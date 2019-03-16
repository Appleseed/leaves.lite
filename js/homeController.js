var env = {};
if(window){  
	Object.assign(env, window.__env);
}

var app = angular.module('leavesNext');
(function(app){

	"use strict";

	app.constant('ENV', env);

	disableLogging.$inject = ['$logProvider', 'ENV'];

	function disableLogging($logProvider, ENV) {
		$logProvider.debugEnabled(ENV.ENABLEDEBUG);
	}

	app.controller('homeController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'ENV', function($scope, $rootScope, $http, $state, $stateParams, ENV) {
    $rootScope.isidexit = 0
    $rootScope.isReaderActive = false
    $scope.stateJson = $state.current
    var page = 1
    $scope.loading_button = false
    $scope.loading_icon = true
    $scope.entries = []
    var itemIds = []
    var dataArray = [];
    $scope.searching = false
    $rootScope.minimizeReader = true
    $scope.current_params = {
        tag: $stateParams.tag
    }

    $rootScope.cardViewActive = true

    if($stateParams.ids !== undefined) {
        $rootScope.cardViewActive = false
    }


    function homeData(loadmore) {
        if(loadmore == 0){
            page = 1
            $scope.entries = []
        }
        var paramsArray = []
        if ($stateParams.tag && $stateParams.tag != 'home') {
            var tagNamesArray = $stateParams.tag.split(',');

            angular.forEach(tagNamesArray, (tagName) => {
                if (tagName.includes('-')) tagName = tagName.split('-').join(' ');

                var param = {
                    access_token: ENV.LEAVES_API_ACCESSTOKEN,
                    sort: 'created',
                    limit: 12,
                    order: 'desc',
                    page: page,
                    tags: tagName
                }

                paramsArray.push(param)
            })
        } else {
            var param = {
                access_token: ENV.LEAVES_API_ACCESSTOKEN,
                sort: 'created',
                limit: 12,
                order: 'desc',
                page: page
            }
            paramsArray.push(param)
        }
        $scope.loadingMessage = true
        if (page >= 2) {
            $scope.loading_button = true
        }
        angular.forEach(paramsArray, (param) => {
            $http({
                method: 'GET',
                url: ENV.LEAVES_API_URL + '/api/entries',
                params: param
            }).then(function(success) {
                $scope.homeData = success
                angular.forEach(success.data._embedded.items, function(value) {
                    $scope.entries.push(value)
                })
            }).catch(function(response) {
                $scope.error = response
            }).finally(function() {
                $scope.loading_icon = false
                if ($scope.entries.length < $scope.homeData.data.total) {
                    $scope.loading_button = true
                    $scope.loadingMessage = false
                }
            })
            
        })

        page = page + 1
    }

    if($stateParams.search){
        searchLeaf($stateParams.search)
    }else{
        homeData(0);
    }

    $scope.loadMore = function() {
        homeData(1);
    }
    
    $scope.minReaderActive = function(){
        $rootScope.isReaderActive = false
    }
    $scope.maxReaderActive = function(){
        $rootScope.isReaderActive = true
    }

    var searchingPage = 1

    $scope.reLoadPage = function(){
        homeData(0);
    }

    $scope.newLeaf = function(incoming_url) {
        firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            $http({
                method: 'POST',
                url: ENV.LEAVES_API_URL + '/api/entries',
                params: { access_token: ENV.LEAVES_API_ACCESSTOKEN },
                data: $.param({
                    url: incoming_url
                }),
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            }).then(function(success) {
                $scope.reLoadPage()
                $scope.leavesurl = ''
                document.getElementById('closeButton').click()
            }).catch(function(response) {
                $scope.error = response
            });
        }else {
            document.getElementById("addleafError").innerHTML = "Please Logged In!"
            $scope.userLoggedIn = false
        }
    })
        
    }

    $scope.searchLeaf = function(searchValue){
        searchLeaf(searchValue)
    }

    function searchLeaf(searchValue){

        if(searchValue !== undefined && searchValue.trim().length > 0) {
            $scope.searching = true
            dataArray = []
            $scope.searchQuery = searchValue.trim()
            loadSearchQuery()
            $state.go('search', {
                search: searchValue
            })
            $scope.mobileSearchBox = false
        }
    }

    $scope.subsTagsArray = []

    if($stateParams.tag !== 'home' && $stateParams.tag !== undefined){
        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                 firebase.database().ref(`/users/${user.uid}`).once('value').then((snapshot) => {
                    var userData = snapshot.val()
                    $scope.$apply(function() {
                        $scope.user = userData
                        var tagsList = $stateParams.tag.split(',')
                        for (var i = 0; i < tagsList.length; i++) {
                            if(userData.tags !== undefined){
                                var tagIndexInArray = userData.tags.findIndex(x => x.slug === tagsList[i])
                                if( tagIndexInArray > -1){
                                    $scope.subsTagsArray.push({label: userData.tags[tagIndexInArray].label, id: userData.tags[tagIndexInArray].id, slug: tagsList[i], isSub: true})
                                }else{
                                    var indexInAllTags = $scope.tags.findIndex(x => x.slug === tagsList[i])
                                    $scope.subsTagsArray.push({label: $scope.tags[indexInAllTags].label, id: $scope.tags[indexInAllTags].id, slug: tagsList[i], isSub: false})
                                }
                            }else{
                                var tagIndex = $scope.tags.findIndex( x => x.slug === tagsList[i] )
                                if(tagIndex > -1){
                                    $scope.subsTagsArray.push({slug: tagsList[i], label: $scope.tags[tagIndex].label, id: $scope.tags[tagIndex].id, isSub: false})
                                }
                            }
                        }
                    })
                });
            }else {
                var tagsList = $stateParams.tag.split(',')
                for (var i = 0; i < tagsList.length; i++) {
                    var tagIndex = $scope.tags.findIndex( x => x.slug === tagsList[i] )
                    if(tagIndex > -1){
                        $scope.subsTagsArray.push({slug: tagsList[i], label: $scope.tags[tagIndex].label, id: $scope.tags[tagIndex].id, isSub: false})
                    }
                }
            }
        })
    }


    if($stateParams.tag === 'home') {

        var tagsListArray = $scope.tags

        for (var i = 0; i < tagsListArray.length; i++) {
            tagsListArray[i].active = false
        }

        $scope.tags = tagsListArray
    }

        
    $scope.minimizeToggle = function() {
        $rootScope.minimizeReader = $rootScope.minimizeReader ? false : true
    }

    $scope.subscribeTag = function(tag, subTagIndex) {

        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                var tagObj = {"id": tag.id, "slug": tag.slug, "label": tag.label}
                $scope.event_on_tag = tag.label
                var tagIndex = $scope.tags.findIndex( x => x.id === tag.id )
                if($scope.user.tags === undefined && tagIndex < 0) {
                    $scope.user.tags = []
                    $scope.user.tags.push(tagObj)
                    $scope.tags[tagIndex].selected = true
                    $scope.subsTagsArray[subTagIndex].isSub = true
                }else{
                    var isTagAvailable = $scope.user.tags.findIndex( x => x.id === tag.id )
                    if(isTagAvailable > -1){
                        var tagArray = $scope.user.tags
                        tagArray.splice(isTagAvailable, 1)
                        $scope.user.tags = tagArray
                        $scope.tags[tagIndex].selected = false
                        $scope.subsTagsArray[subTagIndex].isSub = false
                    }else{
                        $scope.user.tags.push(tagObj)
                        $scope.tags[tagIndex].selected = true
                        $scope.subsTagsArray[subTagIndex].isSub = true
                    }
                }
                firebase.database().ref(`/users/${$scope.user.user_id}/tags`).set($scope.user.tags)
                $scope.$apply();
            }else {
               $('#doLogin').modal('show');
            }
        })
    }

    $scope.mobileSearchBox = false

    $scope.showMobileSearch = function() {
        $scope.mobileSearchBox = $scope.mobileSearchBox ? false : true
    }

    $scope.searchValueReset = false

    $scope.resetSearchValue = function() {
        $scope.searchValueReset = false
        $scope.searchValue = ''
    }

    $scope.fullSearchBox = false;

    $scope.showFullSearchBox = function () {
        $scope.fullSearchBox = $scope.fullSearchBox ? false : true
    }

    $scope.onSearchBoxChange = function(value){
        if(value.length == 0){
            $scope.searchValueReset = false
        }else{
            $scope.searchValueReset = true
        }
    }   

    $scope.loadSearchQuery = function(){
        loadSearchQuery()
    }

    function loadSearchQuery(){
        $scope.loadingMessage = true
        var searchQuery = $stateParams.search
        var searchParams = {
            rows:30,
            start: page * 30,
            q: searchQuery,
            df: 'title',
            df: 'content'
        }
         $http({
            method: 'GET',
            url: 'http://stage.leaves.anant.us/solr/',
            params: searchParams
        }).then((success) => {
            var totalSearchFound = success.data.response.numFound
            $scope.searchTagMessage = totalSearchFound + ' Result Found: "' + searchQuery + '"'
            $scope.searchData = success.data.response.numFound
            angular.forEach(success.data.response.docs, function(value) {
                dataArray.push(value)
            })

            if(totalSearchFound == 0) {
                $scope.loading_icon = false
            }

            if(dataArray.length < success.data.response.numFound) {
                $scope.loading_icon = false
                $scope.loadingMessage = false

            }
            $scope.entries = dataArray
        }).catch(function(response) {
            $scope.error = response
        }).finally(function() {
            page = page + 1
        })
        searchingPage = searchingPage + 1
    }

    $scope.paginationFuntion = function(){
        homeData(1)
    }

	}])

})(app);