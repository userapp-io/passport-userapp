var UserApp = require('../');

UserApp.initialize({
	appId:'YOUR-APP-ID'
});

UserApp.User.login({login:'THE-USER-LOGIN', password:'THE-USER-PASSWORD'}, function(error, result){
	if(error){
		console.log(error);
		return;
	}

	// The authenticated token! When doing a login, this is automatically set.
	// I.e. UserApp.setToken(token) is automatically called with the new token.
	console.log("Now authenticated with token " + result.token);

	UserApp.User.get({/*Pass empty user_id to retrieve 'self'*/}, function(error, result){
		if(error){
			console.log(error);
			return;
		}

		var user = result[0];

		console.log("Hi! My login is '" + user.login + "'' and I have user id '" + user.user_id + "'.");

		//console.log(user); // dump the whole user object to console
	});
});