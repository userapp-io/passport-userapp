'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('MyCtrl1', function($scope, $http, Base64, user) {
		// Call the back-end API which will be authenticated using our token
		$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(':' + user.token());
		$http({method: 'GET', url: '/articles'}).
			success(function(data, status, headers, config) {
				//The API call to the back-end was successful (i.e. a valid token)
				$scope.articles = data;
			}).
			error(function(data, status, headers, config) {
				alert("The API call to the back-end was NOT successful (i.e. an invalid token).");
			});
	});