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

	app.controller('readerController', ['$scope', '$http', '$stateParams', '$timeout', '$rootScope', '$state', 'ENV', '$sce', function($scope, $http, $stateParams, $timeout, $rootScope, $state, ENV, $sce) {

	 var leafIdsList = String($stateParams.ids).split(',')

    $rootScope.inboxLength = leafIdsList.length
    $rootScope.inboxArray = leafIdsList
    $scope.readerView = false
    $rootScope.isidexit = 1


    if(leafIdsList.length > 0) {
        $rootScope.minimizeReader = false
    }

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

                setTimeout(() => {
                    var elmnt = document.getElementById("readerElement");
                    elmnt.scrollIntoView(true);
                }, 200)
            })
        }

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
            $rootScope.cardViewActive = true
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
            var leftPos = $('.reader-tabs').scrollLeft();
            $(".reader-tabs").animate({scrollLeft: leftPos + $rootScope.leaves.length * 200}, 400);
        }

    }

    $scope.changeReaderTab = function(index){
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
            let currentLeaves2 = $rootScope.leaves
            let orderedLeaves2 = currentLeaves2.map(function(i) {
                return i.id;
            }).join(',');
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

})(app);