var UserApp = require('../');

UserApp.initialize({
	appId:'YOUR-APP-ID',
	token:'A-GENERATED-TOKEN'
});

UserApp.User.hasPermission({user_id:'SOME-USER-ID',permission:'SOME-FEATURE-NAME'}, function(error, result){
	if(error){
		console.log(error);
		return;
	}

	if(result.missing_permissions){
		console.log("User is missing permissions " + result.missing_permissions);
		return;
	}

	// User has all the permissions
	console.log("I can do what I want now!");
});