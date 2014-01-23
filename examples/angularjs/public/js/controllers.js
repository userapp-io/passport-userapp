'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('MyCtrl1', function($scope, $http) {
		// Call the back-end API which will be authenticated using our session
		$http({method: 'GET', url: '/articles'}).
			success(function(data, status, headers, config) {
				//The API call to the back-end was successful (i.e. a valid session)
				$scope.articles = data;
			}).
			error(function(data, status, headers, config) {
				alert("The API call to the back-end was NOT successful (i.e. an invalid session).");
			});
	});