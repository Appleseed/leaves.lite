var env = {};

// Import variables if present (from env.js)
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
    console.log('main')
    $scope.card_view = true
    $rootScope.readerFromInbox = true
    $rootScope.listArray = []
    $rootScope.tempArray = []
    $rootScope.leaves = []
    $rootScope.sidenavBarOpen = false

    $scope.goToHome = function() {
        console.log('home')
        $state.go('home', {
            tag: 'home'
        })
        $rootScope.isidexit = 0
        $scope.tagsArray = []
    }

    //$http.get call to get all tags json
    var tags_list = []
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
                slug: slug,
                active: false
            })
        })
    }).catch(function(response) {
        $scope.error = response
    })
    $scope.tags = tags_list

    $scope.inboxToReader = function(leafArray){
        $rootScope.readerFromInbox = false
        $state.go('home.reader', {ids:leafArray})
    }

    $scope.tagsArray = []

    function removeItem(items, i){
        $scope.tagsArray.splice(i, 1)
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
        console.log(slugIndex)
        if(tagIndex < 0){
            $scope.tagsArray.push(tagSlug)
            $scope.tags[slugIndex]['active'] = true
        }else{
            removeItem($scope.tagsArray, tagIndex)
            $scope.tags[slugIndex]['active'] = false
        }
        $state.go('home', {tag:$scope.tagsArray.join(',')})
        sortTagArray()
        console.log($scope.tagsArray)
    }

     $scope.makeBitlyLink = function(){
        $("#shareBundle").modal('show')
        $scope.bitly_link = 'Loading...'
        var threadPath = encodeURIComponent(window.location.href)
        var pathToHit = "https://api-ssl.bitly.com/v3/shorten?access_token="+ENV.BITLY_API_ACCESSTOKEN+"&longUrl=" + threadPath
        $http({
            method: 'GET',
            url: pathToHit
        }).then(function(success) {
            $scope.bitly_link = success.data.data.url
        })
    }

    $scope.newsletterData = function() {
        var obj = {
            'name': $scope.user_name,
            'email': $scope.email,
            'tags': $scope.selectionTag
        }
        console.log(obj)
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

}])



app.controller('homeController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'ENV', function($scope, $rootScope, $http, $state, $stateParams, ENV) {
    console.log('home')
    $rootScope.isidexit = 0
    $rootScope.isReaderActive = false
    $scope.stateJson = $state.current
    var page = 1
    $scope.loading_button = false
    $scope.entries = []
    var itemIds = []
    var dataArray = [];
    $scope.searching = false
    $scope.current_params = {
        tag: $stateParams.tag
    }



    function homeData(loadmore) {
        if(loadmore == 0){
            page = 1
            $scope.entries = []
        }
        if ($stateParams.tag && $stateParams.tag != 'home') {
            var tagName = $stateParams.tag;
            console.log(tagName)
            if (tagName.includes('-')) tagName = tagName.split('-').join(' ');

            var param = {
                access_token: ENV.LEAVES_API_ACCESSTOKEN,
                sort: 'created',
                limit: 12,
                order: 'desc',
                page: page,
                tags: tagName
            }
            console.log(param)
        } else {
            var param = {
                access_token: ENV.LEAVES_API_ACCESSTOKEN,
                sort: 'created',
                limit: 12,
                order: 'desc',
                page: page
            }
        }
        $scope.loadingMessage = true
        if (page >= 2) {
            $scope.loading_button = true
        }
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
            page = page + 1
            if ($scope.entries.length < $scope.homeData.data.total) {
                $scope.loading_button = true
                $scope.loadingMessage = false
            }
        })
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
        console.log($rootScope.isReaderActive)
        $rootScope.isReaderActive = true
    }

    // $scope.entries = dataArray
    var searchingPage = 1

    $scope.reLoadPage = function(){
        console.log('re-loading')
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
                // $scope.entries = success.data
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
                        console.log(userData.tags)
                        for (var i = 0; i < tagsList.length; i++) {
                            var tagIndexInArray = userData.tags.findIndex(x => x.slug === tagsList[i])
                            if( tagIndexInArray > -1){
                                $scope.subsTagsArray.push({label: userData.tags[tagIndexInArray].label, id: userData.tags[tagIndexInArray].id, slug: tagsList[i], isSub: true})
                            }else{
                                var indexInAllTags = $scope.tags.findIndex(x => x.slug === tagsList[i])
                                $scope.subsTagsArray.push({label: $scope.tags[indexInAllTags].label, id: $scope.tags[indexInAllTags].id, slug: tagsList[i], isSub: false})
                            }
                        }
                        
                        // sortArrayByBoolean()
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
        console.log('toggle search box')
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
            q: searchQuery
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
            if(dataArray.length < success.data.response.numFound) {
                $scope.loading_button = true
                $scope.loadingMessage = false

            }
            console.log(success.data.response.numFound)
            console.log(dataArray)
            $scope.entries = dataArray
        }).catch(function(response) {
            $scope.error = response
        }).finally(function() {
            page = page + 1
        })
        searchingPage = searchingPage + 1
    }


}])


app.controller('singleLeaves', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', 'ENV', '$sce', function($scope, $http, $stateParams, $timeout, $rootScope, $state, ENV, $sce) {
    var leafIdsList = String($stateParams.ids).split(',')

    $rootScope.inboxLength = leafIdsList.length
    $rootScope.inboxArray = leafIdsList
    $scope.readerView = false
    $rootScope.isidexit = 1
   

    function leafHTTP(id) {
        var param_list = $stateParams.ids.split(',');
        $scope.active_id = id

        var idIndex = $rootScope.leaves.findIndex(x => x.id== id);
        if(idIndex < 0) {
            $http({
                method: 'GET',
                url: ENV.LEAVES_API_URL + '/api/entries/' + id,
                params: {
                    access_token: ENV.LEAVES_API_ACCESSTOKEN
                }
            }).then(function(success) {
                $rootScope.leaves.push(success.data)

            }).catch(function(response) {
                $scope.error = response
            }).finally(function() {
                $rootScope.leaves[$rootScope.leaves.length - 1].active = true;
                $scope.readerView = true
                if(!$rootScope.isReaderActive){
                    $rootScope.isReaderActive = true
                }
                if($rootScope.leaves.length > 1){
                    $rootScope.leaves[$rootScope.leaves.length - 2].active = false;
                }
                readerCountAndMove()
            })
        }

    }

    console.log('flag ' + $rootScope.flag)

    if ($rootScope.flag == undefined) {
        $rootScope.listArray = leafIdsList
        if($rootScope.readerFromInbox){
            for (var i = 0; i < leafIdsList.length; i++) {
                leafHTTP(leafIdsList[i])
            }
        }
    }
    else {
        if ($rootScope.rm_id) {
            leafHTTP(leafIdsList[leafIdsList.length - 1])
        }
    }

    console.log($rootScope.leaves)
    var removeTab = function(event, index, item_id) {
        event.preventDefault();
        event.stopPropagation();

        if ($state.current.name == 'home.reader') {
            var sendTo = 'home.reader'
            var sendToParent = 'home'
        } else {
            var sendTo = 'list-view.reader'
            var sendToParent = 'list-view'
        }
        var content_index;

        $rootScope.rm_id = false
        var leavesArrayList = $rootScope.leaves
        for (var i = 0; i < leavesArrayList.length; i++) {
            if(leavesArrayList[i].id == item_id){
                content_index = i
            }
        }

        // content_index = $rootScope.leaves.findIndex(i => i.id == item_id)
        $rootScope.leaves.splice(content_index, 1);
        var param_list = $stateParams.ids.split(',');
        var item_index = param_list.indexOf(String(item_id))
        if (item_index > -1) {
            param_list.splice(item_index, 1);
        }
        $rootScope.listArray = param_list
        $state.go(sendTo, {
            ids: param_list
        })
        if (param_list.length == 0) {
            event.preventDefault();
            event.stopPropagation();
            $state.go(sendToParent, {
                ids: $stateParams.tag
            })
            $rootScope.listArray = []
            $rootScope.isidexit = 0
        }

        angular.forEach($rootScope.leaves, function(value, key) {
            $rootScope.leaves[key].active = false
        })

        $rootScope.leaves[$rootScope.leaves.length - 1].active = true
    };

    $scope.removeTab = removeTab;
    
    function readerCountAndMove(){

        var tabWidth = document.getElementById("readerTabs").offsetWidth

        if(tabWidth < $rootScope.leaves.length * 200) {
            console.log('move')
            var leftPos = $('.reader-tabs').scrollLeft();
            $(".reader-tabs").animate({scrollLeft: leftPos + $rootScope.leaves.length * 200}, 400);
        }

    }

    $scope.changeReaderTab = function(index){
        console.log(index)
        for (var i = 0; i < $rootScope.leaves.length; i++) {
            $rootScope.leaves[i].active = false
        }

        $rootScope.leaves[index].active = true
    }

    $scope.sortableOptions = {
        update: function(e, ui) {
            let currentLeaves = $rootScope.leaves
            let orderedLeaves = currentLeaves.map(function(i) {
                return i.id;
            }).join(',');
        },
        stop: function(e, ui) {
            // this callback has the changed model
            let currentLeaves2 = $rootScope.leaves
            let orderedLeaves2 = currentLeaves2.map(function(i) {
                return i.id;
            }).join(',');

            //$state.go('home.reader', { ids: orderedLeave2s })
        }
    };

    $scope.getExternalLink = function(item){
        var link = item.url
        var domain_name = item.domain_name
        if(domain_name == 'www.youtube.com'){
            var y_id = link.split('watch?v=')[1]
            var r_link = 'https://www.youtube.com/watch?v='+y_id
        }else{
            var r_link = link
        }
        return r_link;
    }

    $scope.viewOriginalCOntent = function(original_link) {
        document.getElementById("contentInIframe").style.height = "100%";
        document.getElementById("originalContent").innerHTML = '<iframe src="' + original_link + '" frameborder="0" style="width:100%; height: 100vh;"></iframe>'
        document.body.style.overflow = 'hidden';
    }

     $scope.deliberatelyTrustDangerousSnippet = function(content) {
       return $sce.trustAsHtml(content);
     };

     $scope.moveReaderRight = function(e){
        var leftPos = $('.reader-tabs').scrollLeft();
        $(".reader-tabs").animate({scrollLeft: leftPos + 200}, 400);
     }

      $scope.moveReaderLeft = function(){
        var leftPos = $('.reader-tabs').scrollLeft();
        $(".reader-tabs").animate({scrollLeft: leftPos - 200}, 400);
     }

     $scope.added_date = function(tm) {
        return moment(tm.split('T')[0], "YYYYMMDD").fromNow();
    }

    $scope.tabDropdown = false;

    $scope.toggleDropdown = function(){
        $scope.tabDropdown = $scope.tabDropdown ? false : true
    }


}])

app.controller('profilePage',['$scope', '$window', '$http', 'ENV', '$state', function($scope, $window, $http, ENV, $state){

    $scope.loadingProfile = true;

    firebase.auth().onAuthStateChanged(function(user){
            if(user){
                firebase.database().ref(`/users/${user.uid}`).once('value').then((snapshot) => {
                    var userData = snapshot.val()
                        $scope.$apply(function() {
                        $scope.user = userData
                        if(userData.tags !== undefined){
                            angular.forEach($scope.tags, function(value, key){
                                $scope.tags[key].index_value = key
                                if(userData.tags.findIndex(x => x.id === value.id) > -1){
                                    $scope.tags[key].selected = true
                                }else{
                                    $scope.tags[key].selected = false
                                }
                            })
                        }
                        $scope.loadingProfile = false;
                        // sortArrayByBoolean()
                    })
                });

            }else{
                
                $state.go('home', {
                    tag: 'home'
                })
            }
        })

    function sortArrayByBoolean() {
        $scope.tags.sort(function(x,y){
            return (x.selected === y.selected)? 0 : x.selected ? -1 : 1;
        })
    }

    $scope.addTagToProfile = function(tag, tagIndex){
        var tagObj = {"id": tag.id, "slug": tag.slug, "label": tag.label}
        $scope.event_on_tag = tag.label
        if($scope.user.tags === undefined){
            $scope.user.tags = []
            $scope.user.tags.push(tagObj)
            $scope.tags[tagIndex].selected = true
        }else{
            var isTagAvailable = $scope.user.tags.findIndex( x => x.id === tag.id )
            if(isTagAvailable > -1){
                var tagArray = $scope.user.tags
                tagArray.splice(isTagAvailable, 1)
                $scope.user.tags = tagArray
                $scope.tags[tagIndex].selected = false
                $scope.topic_remove_msg = true
                $scope.topic_add_msg = false
            }else{
                $scope.user.tags.push(tagObj)
                $scope.tags[tagIndex].selected = true
                $scope.topic_add_msg = true
                $scope.topic_remove_msg = false
            }
        }
        $scope.setTags()
        // sortArrayByBoolean()
    }

    $scope.topic_add_msg = false;
    $scope.topic_remove_msg = false;

    $scope.setTags = function(){
        firebase.database().ref(`/users/${$scope.user.user_id}/tags`).set($scope.user.tags)
    }

    $scope.resetSearchInput = function(){
        $scope.tag_name = ''
    }

    var tags_list = []
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
                slug: slug,
                active: false
            })
        })
    }).catch(function(response) {
        $scope.error = response
    })
    $scope.tags = tags_list

    $scope.selectNotificationType = function(v){
        $scope.user.notification_type = v
        firebase.database().ref(`/users/${$scope.user.user_id}/notification_type`).set(v)
    }

    function convertToArray(objData) {
        var ArrayObj = [];
        if(objData !== undefined){
            Object.keys(objData).forEach((key) => { 
                objData[key]['push_key'] = key
                ArrayObj.push(objData[key])
            })
        }

        return ArrayObj;
    }
}])

})(app);