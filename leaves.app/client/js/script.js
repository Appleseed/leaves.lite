
var app = angular.module('leavesNext', ['ui.router', 'ui.bootstrap', 'ui.tab.scroll','ngSanitize'])

app.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
    .state('home', {
        url: '/?tag',
        templateUrl: 'views/card-view.html',
        controller: 'homeController'
    })

    .state('search', {
        url: '/?search',
        templateUrl: 'views/card-view.html',
        controller: 'homeController'
    })

    .state('home.reader', {
        url: 'leaf/:ids',
        templateUrl: 'views/reader.html',
        controller: 'singleLeaves'
    })

    .state('reader', {
        url: '/read/:ids',
        templateUrl: 'views/reader.html',
        controller: 'readerController'
    })

    .state('list-view', {
        url: '/list/?tag',
        templateUrl: 'views/list-view.html',
        controller: 'homeController'
    })

    .state('list-view.reader', {
        url: 'leaf/:ids',
        templateUrl: 'views/reader.html',
        controller: 'singleLeaves'
    })

    .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'profileController'
    })

    $urlRouterProvider.otherwise('/?tag=home');
    // $locationProvider.html5Mode(true);
}])

app.directive('cardTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/card.html',
        scope: {
            data: '=',
            state: "@state",
            listarr: '='
        },
        controller: 'cardTemplateController'
    }
})

app.controller('cardTemplateController', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {

    console.log('card')

    $scope.added_date = function(tm) {
        return tm.split('T')[0]
    }

    $scope.getSingleLeaves = function(id) {
        console.log(id)
    }

    function toastMessage() {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    $scope.getExternalLink = function(data){
        var link;
        if(data.domain_name === 'www.youtube.com'){
            link = data.url.split("url=")[1]
        }else{
            link = data.url
        }
        return link;
    }

}])

app.directive('headerNavbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/navbar.html',
        controller: 'navbarCtrl'
    }
})

app.controller('navbarCtrl',['$scope','$rootScope', '$state', function($scope, $rootScope, $state){

    if($(window).width() > 760){
        $scope.header_logo = false
    }else{
        $scope.header_logo = true
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
                    $('#addLeaf').modal('hide')
                }).catch(function(response) {
                    $scope.error = response
                });
            }else {
                document.getElementById("addleafError").innerHTML = "Please Logged In!"
                $scope.userLoggedIn = false
            }
        })
        
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            $scope.userLoggedIn = true
            $scope.userProfile = user
        }else {
            $scope.userLoggedIn = false
        }
    });

    $scope.makeProfile = function(user){
        firebase.database().ref(`users/${user.uid}`).once('value', function(snapshot) {
            var not_exists = (snapshot.val() === null);
            if(not_exists) {
                console.log('creating profile')
                var userData = {
                    name: user.displayName,
                    email: user.email,
                    user_photo: user.photoURL,
                    provider_id: user.providerId,
                    tags: [],
                    user_id: user.uid
                }

                firebase.database().ref(`users/${user.uid}`).set(userData)
                .then(function(responce){
                    console.log('user registered')
                    location.reload();
                })
            }else{
                console.log('already registered')
                location.reload();
            }
        });
    }

    $scope.googleLogin = function() {
        console.log('logging...')
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                $scope.$apply(function() {
                    console.log('scope init')
                    $scope.makeProfile(user)
                });



                $('#doLogin').modal('hide');
                
                // ...
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
    }

    $scope.doLogout = function() {
        firebase.auth().signOut()
        location.reload();
        $scope.userLoggedIn = false
    }

    $scope.sidebarCollapse = function() {
        $scope.header_logo = $scope.header_logo ? false : true
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    }

    $(document).ready(function () {
        $("#sidebar").mCustomScrollbar({
            theme: "minimal"
        });
    });

}])