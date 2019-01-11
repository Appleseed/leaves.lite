var env = {};
if(window){  
	Object.assign(env, window.__env);
}

var app = angular.module('leavesNext');
(function(app){

	"use strict";

	app.constant('ENV', env);

	disableLogging.$inject = ['$logProvider', 'ENV'];

	// app config
	function disableLogging($logProvider, ENV) {
		$logProvider.debugEnabled(ENV.ENABLEDEBUG);
	}

	app.controller('mainController', ['$scope', '$http', '$state', '$location', '$rootScope','ENV', function($scope, $http, $state, $location, $rootScope, ENV) {

		$rootScope.isidexit = 0
    	$rootScope.readerFromInbox = true
		var tags_list = []
    	$rootScope.listArray = []
    	$rootScope.leaves = []
		$scope.userLoggedIn = false

	    $http({
	        method: 'GET',
	        url: ENV.LEAVES_API_URL + '/api/tags',
	        params: {
	            access_token: ENV.LEAVES_API_ACCESSTOKEN
	        }
	    }).then(function(success) {
	        angular.forEach(success.data, function(value) {
	            var slug = value.label.split(' ').join('-')
	            tags_list.push({
	                id: value.id,
	                label: value.label,
	                slug: slug
	            })
	        })
	    }).catch(function(response) {
	        $scope.error = response
	    })
	    $scope.tags = tags_list

	    $scope.goToHome = function() {
	        $state.go('home', {
	            tag: 'home'
	        })
            $rootScope.cardViewActive = true
	    }

}])
})(app);