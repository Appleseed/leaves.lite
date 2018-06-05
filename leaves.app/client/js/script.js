var app = angular.module('leavesNext', ['ui.router', 'ui.bootstrap', 'ui.tab.scroll'])

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

app.controller('navbarCtrl',['$scope', function($scope){

    $scope.userLoggedIn = false

    firebase.auth().onAuthStateChanged(function(user) {
        $scope.userLoggedIn = true
        // window.user = user; 
        // user is undefined if no user signed in
    });


    $scope.barState = true
    $scope.navCloseOpen = function(state){
        if(state){
            console.log('closed')
            $scope.barState = false
            document.getElementById('sideNav').style.width = '0'
            document.getElementById('sideNav').style.display = 'none'

            document.getElementById('cardSection').style.width = '100%'
        }else{
            console.log('open')
            $scope.barState = true
            document.getElementById('sideNav').style.width = '200px'
            document.getElementById('sideNav').style.display = 'inline-block'
            document.getElementById('cardSection').style.display = 'inline-block'
            document.getElementById('cardSection').style.width = '80%'
        }
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
        console.log('logging...')
        firebase.auth().signInWithEmailAndPassword($scope.loginEmail, $scope.loginPassword)
        .then(function(){
            $('#doLogin').modal('hide');
        })
        .catch(function(err) {
        // Handle errors
        });
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
}])
app.controller('leavesCardCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
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
            $state.go('home.reader', param)
        }
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

