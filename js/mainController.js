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

	app.controller('mainController', ['$scope', '$http', '$state', '$location', '$rootScope','ENV', '$stateParams', '$cookies', function($scope, $http, $state, $location, $rootScope, ENV, $stateParams, $cookies) {

		$rootScope.isidexit = 0
    	$rootScope.readerFromInbox = true
		var tags_list = []
    	$rootScope.listArray = []
    	$rootScope.leaves = []
		$scope.userLoggedIn = false
	    $scope.tagsArray = []

	    

		// var webTour = $cookies.get('webTour') || 0;
		// if(!parseInt(webTour)) {
		// 	setTimeout(function(){
		// 		introJs().start();
		// 	}, 2000)
		// }

		// setTimeout(function(){
		// 	$(".introjs-skipbutton").on('click', (event)=>{
		// 		$cookies.put('webTour', 1)
		// 	});

		// 	$('.introjs-donebutton').on('click', (event)=>{
		// 		$cookies.put('webTour', 1)
		// 	})

		// 	$(document).keyup(function(e) {
		// 		if (e.keyCode === 27){
		// 			$cookies.put('webTour', 1)
		// 		}
		// 	});
		// }, 2000)

	


	    $http({
	        method: 'GET',
	        url: ENV.LEAVES_TAG_API_URL + '/api/leaves/gettagcount',
	        params: {
	            access_token: ENV.LEAVES_API_ACCESSTOKEN
	        }
	    }).then(function(success) {
	        angular.forEach(success.data, function(value) {
	            var slug = value.label.split(' ').join('-')
	            tags_list.push({
	                id: value.id,
	                label: value.label,
	                slug: slug,
                	active: false,
                	no_of_links: value.no_of_links
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
        	$scope.tagsArray = []
	    }

	    function sortTagArray(){
	        $scope.tags.sort(function(x, y) {
	            // true values first
	            return (x.active === y.active)? 0 : x.active? -1 : 1;
	            // false values first
	            // return (x === y)? 0 : x? 1 : -1;
	        });
	    }

	    $scope.multipleTagSelect = function(tagsArrayValues, tagSlug){

	        var tagIndex = $scope.tagsArray.indexOf(tagSlug)
	        var slugIndex = $scope.tags.findIndex(obj => obj.slug == tagSlug);
	        if(tagIndex < 0){
	            $scope.tagsArray.push(tagSlug)
	            $scope.tags[slugIndex]['active'] = true
	        }else{
	            removeItem($scope.tagsArray, tagIndex)
	            $scope.tags[slugIndex]['active'] = false
	        }
	        $state.go('home', {tag:$scope.tagsArray.join(',')})
	        sortTagArray()

	    	if($(window).width() <= 760){
        		$rootScope.header_logo = true
		        $('#sidebar, #content').toggleClass('active');
		        $('.collapse.in').toggleClass('in');
		        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
		    }
	    }

	    function removeItem(items, i){
	        $scope.tagsArray.splice(i, 1)
	    }

	    $scope.selectionTag=[];

		$scope.toggleSelection = function toggleSelection(gender) {
			var idx = $scope.selectionTag.indexOf(gender);
			if (idx > -1) {
				// is currently selected
				$scope.selectionTag.splice(idx, 1);
			}
			else {
				// is newly selected
				$scope.selectionTag.push(gender);
			}
		};

	 	$scope.makeBitlyLink = function(){
	        $("#shareBundle").modal('show')
	        $rootScope.bitly_link = 'Loading...'
	        $scope.longURL = encodeURIComponent(window.location.href)
	        var threadPath = encodeURIComponent(window.location.href)
	        var pathToHit = "https://api-ssl.bitly.com/v3/shorten?access_token="+ENV.BITLY_API_ACCESSTOKEN+"&longUrl=" + threadPath
	        $http({
	            method: 'GET',
	            url: pathToHit
	        }).then(function(success) {
	            $scope.bitly_link = success.data.data.url
	        })
	    }

	    $scope.copyThisShortLink = function() {
    	 	var copyText = document.getElementById("bitlyLink");
	        copyText.select();
	        document.execCommand("Copy");
	        document.getElementById("showCopiedMsg").innerHTML = 'copied'
	        setTimeout(function() {
	            $('#showCopiedMsg').fadeOut('fast');
	        }, 1000);
	    }

}])
})(app);