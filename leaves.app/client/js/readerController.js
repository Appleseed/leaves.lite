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

	app.controller('readerController', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', 'ENV', '$sce', function($scope, $http, $stateParams, $timeout, $rootScope, $state, ENV, $sce) {

		console.log('reader')

		var entriesList = []
		var pageNo = 1
		$scope.loading_button = false
		$scope.loadingMessage = true
		$scope.loading_entry = true
    	$scope.loading_entries = true
		$scope.readersObj = []

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
	        	$scope.loading_entries = false
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

		// $scope.entries = entriesList


		function getReaderEntries() {
	        var param_list = $stateParams.ids.split(',');
	        // $scope.active_id = id
	        console.log(param_list)
	        console.log(typeof($stateParams.ids))
	        console.log($stateParams.ids)
	        $http({
	            method: 'GET',
	            url: ENV.LEAVES_API_URL + '/api/entries/' + $stateParams.ids,
	            params: {
	                access_token: ENV.LEAVES_API_ACCESSTOKEN
	            }
	        }).then(function(success) {
	        	console.log(success.data)
	            $scope.readersObj.push(success.data)
	        }).catch(function(response) {
	            $scope.error = response
	        }).finally(function() {
	        	$scope.loading_entry = false
	            // $scope.readersObj[$scope.readersObj.length - 1].active = true;
	            // $scope.readerView = true
	            // if($scope.readersObj.length > 1){
	            //     $scope.readersObj[$scope.readersObj.length - 2].active = false;
	            // }
	        })
	    }

	    getReaderEntries()

	    $scope.deliberatelyTrustDangerousSnippet = function(content) {
           return $sce.trustAsHtml(content);
        }

        $scope.added_date = function(tm) {
        	if(tm !== undefined){
		        return tm.split('T')[0]
        	}
	    }

	    $scope.getExternalLink = function(data){
	        var link;
	    	if(data !== undefined) {
		        if(data.domain_name === 'www.youtube.com'){
		            link = data.url.split("url=")[1]
		        }else{
		            link = data.url
		        }
	    	}
	        return link;
	    }

	}])

})(app);