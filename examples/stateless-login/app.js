var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    flash = require('connect-flash'),
    _ = require('underscore'),
    UserAppStrategy = require('passport-userapp').Strategy;

var users = [];

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
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs-locals'));
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
    app.use(express.static(__dirname + '/../../public'));
});

app.get('/', passport.authenticate('userapp', { failureRedirect: '/login' }), function (req, res) {
    res.render('index', { user:req.user });
});

app.get('/account', passport.authenticate('userapp', { failureRedirect: '/login' }), function (req, res) {
    res.render('account', { user:req.user });
});

app.get('/login', function (req, res) {
    res.render('login', { user:req.user, message:req.flash('error') });
});

// POST /login
app.post('/login',
    passport.authenticate('userapp', { failureRedirect: '/login', failureFlash: 'Invalid username or password.'}),
    function (req, res) {
        res.cookie('ua_session_token', req.user.token);
        res.redirect('/');
    }
);

// GET /logout
app.get('/logout', function (req, res) {
    req.logout();
    res.clearCookie('ua_session_token');
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});