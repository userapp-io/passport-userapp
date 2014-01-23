'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers',
	'UserApp'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', public: true, login: true});
	$routeProvider.when('/signup', {templateUrl: 'partials/signup.html', public: true});
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
	$routeProvider.otherwise({redirectTo: '/view1'});
}])
.run(function($rootScope, user) {
	user.init({ appId: 'YOUR-USERAPP-APP-ID' }); // Your UserApp App Id: https://help.userapp.io/customer/portal/articles/1322336-how-do-i-find-my-app-id-
});
