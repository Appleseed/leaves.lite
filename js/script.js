var app = angular.module('leavesNext', ['ui.router','ngSanitize','ngCookies','720kb.socialshare'])

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
    $(document).ready(function() {feather.replace()});
    
}])

app.directive('headerNavbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/directives/navbar.html',
        controller: 'navbarCtrl'
    }
})

app.controller('navbarCtrl',['$scope','$rootScope', '$state', '$http', 'ENV', '$cookies', '$stateParams', function($scope, $rootScope, $state, $http, ENV, $cookies, $stateParams){
    $scope.searchInputVisible = false
    $scope.showLinksDrawer = false;

    if($(window).width() > 760){
        $rootScope.header_logo = false
    }else{
        $rootScope.header_logo = true
    }

    function showToast() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


    $scope.newLeaf = function(incoming_url) {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                $scope.addingMsg = "Adding..."
                var params = {
                    url: incoming_url
                }
                if($stateParams.tag !== undefined && $stateParams.tag !== 'home'){
                    params['tags'] = $stateParams.tag
                    $scope.routeTags = $stateParams.tag
                }

                var keywordsArray = []

                for (var i = 0; i < $scope.preview_data_tags.length; i++) {
                    if($scope.preview_data_tags[i].selected){
                        keywordsArray.push($scope.preview_data_tags[i].name)
                    }
                    
                }

                keywordsArray.join(',')

                if(keywordsArray.length > 0){
                    if($stateParams.tag !== undefined && $stateParams.tag !== 'home'){
                        params['tags'] = params['tags'] +','+ keywordsArray
                    }else {
                        params['tags'] = keywordsArray
                    }
                    
                }


                $http({
                    method: 'POST',
                    url: ENV.LEAVES_API_URL + '/api/entries',
                    params: { access_token: ENV.LEAVES_API_ACCESSTOKEN },
                    data: $.param(params),
                    headers: { 'content-type': 'application/x-www-form-urlencoded' }
                }).then((success) => {
                    // $scope.entries = success.data
                    $scope.linkAdded = "Link added"
                    $scope.addingMsg = ""
                    $scope.leavesurl = ''
                    document.getElementById('leavesurl').value = ''
                    $scope.preview_data = {
                        'source_url': '',
                        'title': '',
                        'summary': '',

                    }
                    $scope.preview_data_tags = []
                    setTimeout(()=>{
                        $scope.linkAdded = ""
                        document.getElementById('closeButton').click()
                            // window.location.reload();
                    }, 1000)

                    setTimeout(()=>{
                        showToast()
                    }, 2000)
                    
                }).catch(function(response) {
                    $scope.error = response
                });
            }else {
                document.getElementById("addleafError").innerHTML = "Please Logged In!"
                $scope.userLoggedIn = false
            }
        })
        
    }

    function snapToArray(snapshot){
        const articles = Object.entries(snapshot).map(article => {
            return Object.assign({}, { id: article[0] }, article[1]);
        });
        return articles
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if(user){            
            $scope.$apply(()=> {
                $scope.userLoggedIn = true
                $scope.userProfile = user
            });
            firebase.database().ref(`users/${user.uid}`).once('value', function(snapshot) {
                var fireData = snapshot.val()
                $scope.$apply(()=> {
                    $scope.savedLinks = snapToArray(fireData['saved-links'])
                });
                
                
            });
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

    console.log($rootScope.userProfile)

    $scope.saveBranchLinkToProfile = function(){
        $scope.saveBundleMsg = ""
        var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                if($scope.branch_custom_title.trim().length === 0){
                    $scope.$apply(()=> {
                        $scope.saveBundleMsg = "Please input the branch name"
                    });
                }else{
                    if($scope.bitly_link !== undefined && re.test($scope.bitly_link)){
                        var newKey =  firebase.database().ref(`users/${user.uid}/saved-links`).push()
                        var id = newKey.key
                        var branchObj = {
                            'name': $scope.branch_custom_title,
                            'short_link': $scope.bitly_link,
                            'id': id
                        }
                        firebase.database().ref(`users/${user.uid}/saved-links/${id}`).set(branchObj)
                        .then((responce)=>{
                            $scope.$apply(()=> {
                                $scope.saveBundleSuccesMsg = "Successfully! Saved."
                                setTimeout(()=>{
                                    $scope.saveBundleSuccesMsg = ""
                                    $scope.savedLinks.push(branchObj)
                                },2000)
                            });
                        })
                    }else{
                        $scope.$apply(()=> {
                            $scope.saveBundleMsg = "Please try again or refresh the page."
                        });
                    }
                }
            }else {
                $scope.$apply(()=> {
                    $scope.saveBundleMsg = "First, Login to save the branch link"
                });
            }
        });
    }

    $scope.removeTheBranch = function(id, index) {
        console.log(id)
        firebase.auth().onAuthStateChanged(function(user) {
        if(user){            
            firebase.database().ref(`users/${user.uid}/saved-links/${id}`).remove()
            .then((responce)=>{
                console.log('link removed')
                    $scope.$apply(()=> {
                        $scope.savedLinks.splice(index, 1)
                    });
            })
        }else {
            $scope.userLoggedIn = false
        }
    });
        
    }

    $scope.showSavedLinks = function() {
        $scope.showLinksDrawer = $scope.showLinksDrawer ? false : true
    }

    $scope.getPreviewData = function(url) {
        if($stateParams.tag !== undefined && $stateParams.tag !== 'home'){
            console.log('taa')
            $scope.routeTags = $stateParams.tag
        }

        $scope.loading_preview = true
        $http({
            method: 'GET',
            url: 'https://anant-spider.herokuapp.com/scrap',
            params: { url: url },
        }).then((success) => {
            $scope.loading_preview = false
            $scope.preview_data = success.data
            var scrappedKeyword = success.data.keywords
            var keyObjArray = []
            for (var i = 0; i < scrappedKeyword.length; i++) {
                keyObjArray.push({'name': scrappedKeyword[i], 'selected': false})
            }
            $scope.preview_data_tags = keyObjArray
        }).catch(function(response) {
            $scope.error = response
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

    $scope.branch_custom_title = ""

    $scope.trimCustomBranchName = function(title) {
        console.log(title)
    } 

    $scope.pickTheTag = function(tag, index) {
        var statusValue = $scope.preview_data_tags[index].selected
        $scope.preview_data_tags[index].selected = statusValue ? false : true
    }

    // $(document).ready(function () {
    //     $("#sidebar").mCustomScrollbar({
    //         theme: "minimal"
    //     });
    // });


    $scope.takeTour = function() {
        $cookies.put('webTour', 0)
        introJs().start();
    }

}])