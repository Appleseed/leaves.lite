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


	app.controller('profileController',['$scope', '$window', '$http', 'ENV', '$state', function($scope, $window, $http, ENV, $state){

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
        var tagsForDB = []
        angular.forEach($scope.user.tags, function(value, key){
            tagsForDB.push({id: value.id, label: value.label, slug: value.slug})
        })
        var ref = '/users/' + $scope.user.user_id + '/tags'
        firebase.database().ref(ref).set(tagsForDB)
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