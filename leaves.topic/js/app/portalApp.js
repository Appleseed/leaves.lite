/* portalApp.js */


// TODO: fix this to take a parameter from the HTML or from url route / parameter / dropdown?
// Check angular routes for pulling data-source from url

var portalApp = angular.module('portalApp', ['angular.filter', 'ngSanitize']);
//,function($locationProvider){
//$locationProvider.html5Mode(true);
//}
portalApp.controller('DocCtrl', function($scope, $rootScope, $http, $location) {

    var dataloc = 'data/';
    var topic = '';
    $scope.topic = '';

    console.log("source: " + $scope.source);


    $scope.init = function(topic) {
        $scope.topic = topic;

        var data = 'data/';
        var topicSourceUrl = data + 'topic.' + $scope.topic + '.js';

        $http.get(topicSourceUrl).success(function(data) {
            $scope.documents = data._embedded.items;
        });

        $scope.topic = topic;

        var loc = $location.path();

        if ($scope.topic == '') {
            $scope.source = dataloc + 'topic.anantco.js';
        } else {
            $scope.source = dataloc + 'topic.' + $scope.topic + '.js';
        }

        $http.get($scope.source).success(function(data) {
            $scope.documents = data._embedded.items;
        });

        console.log("data:" + $scope.documents);


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