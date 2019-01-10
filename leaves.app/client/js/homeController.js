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

	app.controller('homeController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'ENV', function($scope, $rootScope, $http, $state, $stateParams, ENV) {
		console.log('home')

		var entriesList = []
		var pageNo = 1
		$scope.loading_button = false
		$scope.loading_icon = true
		$scope.loadingMessage = true

		function getEntries() {

			$scope.loadingMessage = true

			if ($stateParams.tag && $stateParams.tag != 'home') {
	            var tagName = $stateParams.tag;
	            if (tagName.includes('-')) tagName = tagName.split('-').join(' ');
	            var param = {
	                access_token: ENV.LEAVES_API_ACCESSTOKEN,
	                sort: 'created',
	                order: 'desc',
	                page: pageNo,
	                tags: tagName,
	                perPage: 36
	            }
	        } else {
	            var param = {
	                access_token: ENV.LEAVES_API_ACCESSTOKEN,
	                sort: 'created',
	                order: 'desc',
	                page: pageNo,
	                perPage: 36
	            }
	        }

	        if (pageNo >= 2) {
	            $scope.loading_button = true
	        }

			$http({
	            method: 'GET',
	            url: ENV.LEAVES_API_URL + '/api/entries',
	            params: param
	        }).then(function(success) {
	            $scope.entriesData = success
	            angular.forEach(success.data._embedded.items, function(value) {
	                entriesList.push(value)
	            })
	        }).catch(function(response) {
            	$scope.error = response
	        }).finally(function() {
				$scope.loading_icon = false
	            pageNo = pageNo + 1
	            if (entriesList.length < $scope.entriesData.data.total) {
	                $scope.loading_button = true
	                $scope.loadingMessage = false
	            }
	        })
		}

		getEntries()

 		$scope.loadMore = function() {
			getEntries();
		}

		$scope.entries = entriesList
	}])

})(app);