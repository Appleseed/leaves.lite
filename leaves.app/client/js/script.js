var app = angular.module('leavesNext', ['ui.router', 'ui.bootstrap', 'ui.tab.scroll','ngSanitize'])

app.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('home', {
            url: '/?tag',
            templateUrl: 'views/card-view.html',
            controller: 'homeController'
        })

    .state('home.reader', {
        url: 'leaf/:ids',
        templateUrl: 'views/reader.html',
        controller: 'singleLeaves'
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

    $urlRouterProvider.otherwise('/?tag=home');
    // $locationProvider.html5Mode(true);
}])

app.directive('leavesNav', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/navbar.html',
        controller: 'navbarCtrl'
    }
})


app.directive('leavesCard', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/leaves-card.html',
        scope: {
            data: '=',
            state: "@state",
            listarr: '='
        },
        controller: 'leavesCardCtrl'
    }
})


app.directive('leavesList', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/leaves-list.html',
        scope: {
            data: '=',
            state: "@state",
            listarr: '='

        },
        controller: 'leavesListCtrl'
    }
})

app.controller('navbarCtrl',['$scope','$rootScope', function($scope, $rootScope){

    $scope.userLoggedIn = false

    $scope.openLeafForm = function() {
        $('#addLeaf').modal('show');
        firebase.auth().onAuthStateChanged(function(user){
            if(!user){
                document.getElementById("loginMsg").innerHTML = "Please logged In"
            }
        })
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            $scope.userLoggedIn = true
        }else {
            $scope.userLoggedIn = false
        }
    });


     
    $scope.navCloseOpen = function(){
         $rootScope.sidenavBarOpen = $rootScope.sidenavBarOpen ? false : true
        console.log($rootScope.sidenavBarOpen)
    }

    $scope.closeDrawer = function(){
        $rootScope.sidenavBarOpen = false
    }

    $scope.makeNewAccount = function() {
        var password = document.getElementById("signupPassword");
        var confirm_password = document.getElementById("signupConfirmPassword");
        if(password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            firebase.auth().createUserWithEmailAndPassword('mddanishyusuf@gmail.com', '1234qwer').catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
        }
        
    }

    $scope.loginMe = function(){
        firebase.auth().onAuthStateChanged(function(user){
             if(user){
                $scope.userLoggedIn = true;
            }else{
                firebase.auth().signInWithEmailAndPassword($scope.loginEmail, $scope.loginPassword)
                .then(function(){
                    $('#doLogin').modal('hide');
                    location.reload();
                })
                .catch(function(err) {
                    // Handle errors
                });
            }
        })


    }



    $scope.googleLogin = function() {
        firebase.auth().onAuthStateChanged(function(user){
             if(user){
                $scope.userLoggedIn = true;
            }else{
                var provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth().signInWithPopup(provider).then(function(result) {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        var token = result.credential.accessToken;
                        // The signed-in user info.
                        var user = result.user;
                        $('#doLogin').modal('hide');
                        location.reload();
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
        })
    }


    $scope.doLogout = function() {
        firebase.auth().signOut()
        .catch(function (err) {
        // Handle errors
        });
        $scope.userLoggedIn = false
    }
}])

app.controller('leavesListCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
    $scope.added_date = function(tm) {
        return tm.split('T')[0]
    }
    $scope.getSingleLeaves = function(id, listarr) {
        document.getElementById('shareModal').style.display = "none";
        $rootScope.rm_id = true
        $rootScope.flag = 1
        if (listarr.indexOf(id) === -1) {
            listarr.push(id)
            $scope.listArray = listarr
            var param = { ids: listarr }
            $state.go('list-view.reader', param)
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
app.controller('leavesCardCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
    $scope.added_date = function(tm) {
        return tm.split('T')[0]
    }
    $scope.getSingleLeaves = function(id, listarr) {
        var leave_id = String(id)
        document.getElementById('shareModal').style.display = "none";
        $rootScope.rm_id = true
        $rootScope.flag = 1
        if (listarr.indexOf(leave_id) === -1) {
            listarr.push(leave_id)
            $scope.listArray = listarr
            var param = { ids: listarr }
            $state.go('home.reader', param)
        }else{
            alert("Already Added.");
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

app.filter('htmlToPlaintext', function() {
    return function(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
})


app.run(function($rootScope) {
    $rootScope.leavesTeamID = "anantco";
});

// TODO make the tabs sortable

