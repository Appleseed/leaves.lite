/* portalApp.js */


// TODO: fix this to take a parameter from the HTML or from url route / parameter / dropdown?
// Check angular routes for pulling data-source from url

var portalApp = angular.module('portalApp', ['angular.filter', 'ngSanitize'], function($locationProvider) {
    $locationProvider.html5Mode(true);
});

portalApp.controller('DocCtrl', function($scope, $rootScope, $http, $location) {

    $scope.base_url = 'http://qrisp.eastus.cloudapp.azure.com'
    $rootScope.listArray = []
    $rootScope.tempArray = []
    $rootScope.leaves = []
    $scope.token = 'N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw'

    var page = 1;
    var dataloc = 'data/';
    var topic = '';
    $scope.topic = '';

    console.log("source: " + $scope.source);

    $scope.init = function(topic) {
        $scope.topic = topic;

        if ($location.search()['topic'] != undefined) {
            console.log($location.search()['topic']);
            $scope.topic = $location.search()['topic']
        }

        var data = 'data/';
        var topicSourceUrl = data + 'topic.' + $scope.topic + '.js';
        var loc = $location.path();

        if ($scope.topic == '') {
            $scope.source = dataloc + 'topic.anantco.js';
        } else {
            $scope.source = dataloc + 'topic.' + $scope.topic + '.js';
        }

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

portalApp.filter('searchFor', function() {
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


portalApp.filter('highlightWord', function() {
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