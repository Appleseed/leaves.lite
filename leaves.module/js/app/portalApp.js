/* portalApp.js */


// TODO: fix this to take a parameter from the HTML or from url route / parameter / dropdown?
// Check angular routes for pulling data-source from url

var app = angular.module('portalApp', ['angular.filter', 'ngSanitize'], function($locationProvider) {
    $locationProvider.html5Mode(true);
});

app.run(function($rootScope) {
    $rootScope.leavesTeamID = "anantco";
});

app.controller('DocCtrl', function($scope, $rootScope, $http, $location) {

    $scope.base_url = 'http://leaves.anant.us:82'
    $rootScope.listArray = []
    $rootScope.tempArray = []
    $rootScope.leaves = []
    $scope.token = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw'

    $scope.topic = '';

    $scope.init = function(topic) {
        $scope.topic = topic;

        var data = 'data/';
        var teams = data + 'teams.config.json';
        var loc = $location.path();

        // get teams from JS file (for now)
        // TODO : refactor to use auth0 + firebase
        $http({
            method: 'GET',
            url: teams
        }).then(function(success) {
            for (var i = 0; i < success.length; i++) {
                console.log(i);
                if (success[i].id == $rootScope.leavesTeamID) {
                    console.log(success[i]);
                    //TODO: set $scope.base_url
                    //TODO: set $scope.token
                }
            }
        });

        //TODO: begin - refactor this into a function
        if ($location.search()['topic'] != undefined) {
            console.log($location.search()['topic']);
            $scope.topic = $location.search()['topic']
        }

        if ($scope.topic == '') {
            $scope.topic = null;
        }
        //TODO: end - refactor this into a function
        var page = 1;
        var param = {
            access_token: $scope.token,
            sort: 'created',
            perPage: 50,
            order: 'desc',
            page: page,
            tags: $scope.topic
        }

        $http({
            method: 'GET',
            url: $scope.base_url + '/api/entries',
            params: param
        }).then(function(success) {
            $scope.documents = success.data._embedded.items;
        });

        //$http.get(topicSourceUrl).success(function(data) {
        //    $scope.documents = data._embedded.items;
        //});

    };




    $scope.CategoryCount = function() {
        var count = 0;
        angular.forEach($scope.document, function(category) {
            count += category === category;
        });
        return count;
    };
    //{{documents | (filter:CategoryCount).length}}

    $scope.GetCategory = function(category) {
        $scope.CatFilter = { domain_name: category };
        return $scope.CatFilter;
    };



});

app.filter('searchFor', function() {
    return function(arr, searchString) {
      console.log(searchString);

        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item) {
            if (item.title.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            } else if (item.content.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            } else if (item.url.toLowerCase().indexOf(searchString) !== -1) {
               result.push(item);
            }
            //else if (item.tags.toLowerCase().indexOf(searchString) !== -1) {
            //result.push(item);
            //}
        });
        return result;
    };
});

//TODO: look for multiple terms https://stackoverflow.com/questions/15519713/highlighting-a-filtered-result-in-angularjs
//TODO: or implement lunr https://lunrjs.com/guides/getting_started.html
//TODO : or just use Angular UI


app.filter('highlightWord', function() {
    return function(text, searchString) {
        if (searchString) {
            var pattern = new RegExp(searchString, "gi");
            var highlighted = text.replace(pattern, '<span class="highlighted">' + searchString + '</span>');
            return highlighted;
          } else {
            return text;
        }
    };
});


//catdata.CatFilter = {category: '{{doc.category}}'}
