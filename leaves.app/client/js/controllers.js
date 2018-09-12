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

    app.controller('rootController',['ENV', function(ENV){
        if(ENV.GOOGLE_ANALYTICS_CODE){
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KD9CDQS');   
            window._pt_lt=(new Date).getTime(),window._pt_sp_2=[],_pt_sp_2.push("setAccount,18d76dd8");var _protocol="https:"==document.location.protocol?" https://":" http://";!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=_protocol+"cjs.ptengine.com/pta_en.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}(); 
        }
    }])

  app.controller('mainController', ['$scope', '$http', '$state', '$location', '$rootScope','ENV', function($scope, $http, $state, $location, $rootScope, ENV) {
    console.log(ENV)
    $scope.card_view = true
    $rootScope.readerFromInbox = true
    $rootScope.listArray = []
    $rootScope.tempArray = []
    $rootScope.leaves = []

    $scope.goToHome = function() {
        $state.go('home', {
            tag: 'home'
        })
        $rootScope.isidexit = 0
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
                $scope.entries = success.data
                $scope.leavesurl = ''
                document.getElementById('closeButton').click()
            }).catch(function(response) {
                $scope.error = response
            });
        }else {
            document.getElementById("addleafError").innerHTML = "Please Logged In!"
            $scope.userLoggedIn = false
        }
    });
        
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
                slug: slug
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


     $scope.makeBitlyLink = function(){
        document.getElementById('shareModal').style.display = "block";
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

}])



app.controller('homeController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'ENV', function($scope, $rootScope, $http, $state, $stateParams, ENV) {

    $rootScope.isidexit = 0
    $scope.stateJson = $state.current
    var page = 1
    $scope.loading_button = false
    var dataArray = []
    var itemIds = []
    $scope.current_params = {
        tag: $stateParams.tag
    }

    function homeData(loadmore) {
        if ($stateParams.tag && $stateParams.tag != 'home') {
            var tagName = $stateParams.tag;
            if (tagName.includes('-')) tagName = tagName.split('-').join(' ');

            var param = {
                access_token: ENV.LEAVES_API_ACCESSTOKEN,
                sort: 'created',
                limit: 12,
                order: 'desc',
                page: page,
                tags: tagName
            }
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
                dataArray.push(value)
            })
        }).catch(function(response) {
            $scope.error = response
        }).finally(function() {
            page = page + 1
            if (dataArray.length < $scope.homeData.data.total) {
                $scope.loading_button = true
                $scope.loadingMessage = false
            }
        })
    }

    homeData(0);

    $scope.loadMore = function() {
        homeData(1);
    }
    $scope.entries = dataArray
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
            if($rootScope.leaves.length > 1){
                $rootScope.leaves[$rootScope.leaves.length - 2].active = false;
            }
        })
    }
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
    };

    $scope.removeTab = removeTab;

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

}])
})(app);
