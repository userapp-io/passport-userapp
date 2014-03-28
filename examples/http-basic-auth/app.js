var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    flash = require('connect-flash'),
    _ = require('underscore'),
    UserAppStrategy = require('passport-userapp').Strategy;

// Local storage for our users and their articles
var users = [];
var articles = [{
    id: '1',
    title: 'Title 1',
    body: 'Body 1'
},{
    id: '2',
    title: 'Title 2',
    body: 'Body 2'
}];

// Passport session setup
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    var user = _.find(users, function (user) {
        return user.username == username;
    });
    if (user === undefined) {
        done(new Error('No user with username "' + username + '" found.'));
    } else {
        done(null, user);
    }
});

// Use the UserAppStrategy within Passport
passport.use(
    new UserAppStrategy({
        appId: 'YOUR-USERAPP-APP-ID' // Your UserApp App Id: https://help.userapp.io/customer/portal/articles/1322336-how-do-i-find-my-app-id-
    },
    function (userprofile, done) {
        process.nextTick(function () {
            var exists = _.any(users, function (user) {
                return user.id == userprofile.id;
            });
            
            if (!exists) {
                users.push(userprofile);
            }

            return done(null, userprofile);
        });
    }
));

var app = express();

// Configure Express
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'secret' }));
    app.use(flash());
    
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

/* 
 * To get the articles, you need to provide a valid UserApp session token in
 * the password field in the HTTP Basic Authentication header, which has been provided by the AngularJS front-end.
 * Once the front-end has authenticated to the back-end, the session will be cached
 * to save round-trips to UserApp's API.
 */
app.get('/articles', passport.authenticate('userapp'), function (req, res) {
    res.send(articles);
});

// Start the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});