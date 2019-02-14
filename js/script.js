
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
        controller: 'readerController'
    })

    // .state('reader', {
    //     url: '/read?tag',
    //     templateUrl: 'views/reader-view.html',
    //     controller: 'readerViewController'
    // })

    // .state('reader.read', {
    //     url: ':ids?tag',
    //     templateUrl: 'views/reader.html',
    //     controller: 'readerController'
    // })

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

app.controller('cardTemplateController', ['$scope', '$state', '$rootScope', '$stateParams', function($scope, $state, $rootScope, $stateParams) {

   $scope.added_date = function(tm) {
        return moment(tm.split('T')[0], "YYYYMMDD").fromNow();
    }
    $scope.getSingleLeaves = function(id, listarr) {
        $rootScope.cardViewActive = false
        $rootScope.minimizeReader = false
        var leave_id = String(id)
        $rootScope.rm_id = true
        $rootScope.flag = 1
        if (listarr.indexOf(leave_id) === -1) {
            listarr.push(leave_id)
            $scope.listArray = listarr
            var param = { ids: listarr }
            $state.go('home.reader', param)
        }else{
            // alert("Already Added.");
            var ind = $rootScope.leaves.findIndex( x => x.id == id )
                
            angular.forEach($rootScope.leaves, function(value, key) {
                $rootScope.leaves[key].active = false
            })
             
            $rootScope.leaves[ind].active = true

            setTimeout(() => {
                console.log('scroll to top')
                var elmnt = document.getElementById("readerElement");
                elmnt.scrollIntoView({ behavior: 'smooth' });
            }, 2000)
        }
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

app.controller('navbarCtrl',['$scope','$rootScope', '$state', '$http', 'ENV', function($scope, $rootScope, $state, $http, ENV){
    $scope.searchInputVisible = false

    if($(window).width() > 760){
        $rootScope.header_logo = false
    }else{
        $rootScope.header_logo = true
    }

    $scope.newLeaf = function(incoming_url) {
        firebase.auth().onAuthStateChanged((user) => {
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

    $scope.loginFn = function(type) {

        var provider;

        if(type === 'google'){
            provider = new firebase.auth.GoogleAuthProvider();
        }else if(type === 'facebook'){
            provider = new firebase.auth.FacebookAuthProvider();
        }else if(type === 'twitter'){
            provider = new firebase.auth.TwitterAuthProvider();
        }else{
            provider = new firebase.auth.GithubAuthProvider();
        }

        console.log(provider)

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

        // firebase.auth().signInWithPopup(provider).then(function(result) {
        //         // This gives you a Google Access Token. You can use it to access the Google API.
        //         var token = result.credential.accessToken;
        //         // The signed-in user info.
        //         var user = result.user;
        //         $scope.$apply(function() {
        //             console.log('scope init')
        //             $scope.makeProfile(user)
        //         });



        //         $('#doLogin').modal('hide');
                
        //         // ...
        //     }).catch(function(error) {
        //         // Handle Errors here.
        //         var errorCode = error.code;
        //         var errorMessage = error.message;
        //         // The email of the user's account used.
        //         var email = error.email;
        //         // The firebase.auth.AuthCredential type that was used.
        //         var credential = error.credential;
        //         // ...
        //     });
    }

    $scope.loginWithEmail = function() {
        firebase.auth().signInWithEmailAndPassword($scope.loginEmail, $scope.loginPassword).catch((error)=> {
            console.log(error)
            $scope.$apply(function () {
                $scope.errorMessage = error.message;
            });
            var errorCode = error.code;
        });

    }

    $scope.makeNewAccountWithEmail = function() {
        firebase.auth().createUserWithEmailAndPassword($scope.email_address, $scope.password).then(function(result){
             // This gives you a Google Access Token. You can use it to access the Google API.
                // The signed-in user info.
                var user = result.user;
                $scope.$apply(function() {
                    $scope.makeProfile(user)
                });

                $('#doLogin').modal('hide');
        }).catch((error)=> {
            console.log(error)
            $scope.$apply(function () {
                $scope.errorMessage = error.message;
            });
            var errorCode = error.code;
        });
    }

    $scope.doLogout = function() {
        firebase.auth().signOut()
        location.reload();
        $scope.userLoggedIn = false
    }

    $scope.sidebarCollapse = function() {
        $rootScope.header_logo = $rootScope.header_logo ? false : true
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    }

    $scope.toggleSearchInput = function() {
        $scope.searchInputVisible = $scope.searchInputVisible ? false : true
    }

    $scope.searchLeaf = function(searchValue){
        searchLeaf(searchValue)
    }

    function searchLeaf(searchValue){

        if(searchValue !== undefined && searchValue.trim().length > 0) {
            $scope.searching = true
            dataArray = []
            $scope.searchQuery = searchValue.trim()
            $state.go('search', {
                search: searchValue
            })
            $scope.mobileSearchBox = false
        }
    }

    $scope.searchValueReset = false

    $scope.resetSearchValue = function() {
        $scope.searchValueReset = false
        $scope.searchValue = ''
    }

    $scope.onSearchBoxChange = function(value){
        if(value.length == 0){
            $scope.searchValueReset = false
        }else{
            $scope.searchValueReset = true
        }
    }   

    // $(document).ready(function () {
    //     $("#sidebar").mCustomScrollbar({
    //         theme: "minimal"
    //     });
    // });

}])