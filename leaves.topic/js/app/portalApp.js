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

    $scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
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
            limit: 12,
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
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function(item) {
            if (item.title.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            } else if (item.name.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            } else if (item.content.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
            //else if (item.tags.toLowerCase().indexOf(searchString) !== -1) {
            //result.push(item);
            //}
        });
        return result;
    };
});


app.filter('highlightWord', function() {
    return function(text, selectedWord) {
        if (selectedWord) {
            var pattern = new RegExp(selectedWord, "gi");
            return text.replace(pattern, '<span class="highlighted">' + selectedWord + '</span>');
        } else {
            return text;
        }
    };
});


//catdata.CatFilter = {category: '{{doc.category}}'}