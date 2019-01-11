/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* SearchHistoryController                                                   */

/**
 * Search history controller. Lists the last N user search queries. Takes the
 * form of a queue.
 * @param $scope Controller scope
 * @param SolrSearchService Solr search service
 */
function SearchHistoryController($scope,$rootScope, $attrs, $location, SolrSearchService) {
    // $scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService
    //ori ($scope, $attrs, SolrSearchService)
    // parameters
    $scope.maxItems = 5;                // the maximum number of items to display
    $scope.queries = [];                // list of user queries in reverse order
    $scope.queryName = SolrSearchService.defaultQueryName; //'defaultQuery';  // the name of the query to watch
    $rootScope.historyQueries =[];

    $rootScope.currentQueries = [];


    ///////////////////////////////////////////////////////////////////////////


    function SearchHistoryItem(Query, Hash) {
        this.query = Query;
        this.hash = Hash;
    }

    /**
     * Initialize the controller.
     */
    $scope.init = function() {
        // apply configured attributes
        for (var key in $attrs) {
            if ($scope.hasOwnProperty(key)) {
                $scope[key] = $attrs[key];
            }
        }
        // Handle update events from the search service.
        $scope.$on($scope.queryName, function() {

            $scope.handleUpdate();
        });


    };

    /**
     * Update the controller state.
     */
    /*
     $scope.handleUpdate = function() {
     // get the new query
     var newquery = SolrSearchService.getQuery($scope.queryName);
     // if there are existing queries
     if ($scope.queries.length > 0) {
     // if the new user query is different from the last one, add it to
     // the top of the queue
     if (newquery.getUserQuery() != $scope.queries[0].getUserQuery()) {
     //$scope.queries.unshift(newquery);
     // if there are more than maxItems in the list, remove the first item
     if ($scope.queries.length > $scope.maxItems) {
     $scope.queries.pop();
     }
     }
     } else {
     $scope.queries = [];
     $scope.queries.push(newquery);


     }

     /*    if($scope.queries.indexOf(newquery) == -1) {
     $scope.queries.push(newquery)
     }*/


    /*if($scope.historyQueries.length === 0) {
     $scope.historyQueries.push(new SearchHistoryItem(newquery.query, newquery.getHash()));
     }

     $scope.uniqueVal = function(query) {
     if ($scope.historyQueries.indexOf(newquery.query) == -1) {

     $scope.historyQueries.reverse();
     $scope.historyQueries.push(new SearchHistoryItem(newquery.query, newquery.getHash()));
     }
     $scope.historyQueries.reverse();

     }

     };
     */
    /**
     * Update the controller state.
     */

    $scope.handleUpdate = function() {
        // get the new query
        var newquery = SolrSearchService.getQuery($scope.queryName);

        if($rootScope.historyQueries.length === 0) {
            $rootScope.historyQueries.push(new SearchHistoryItem(newquery.query, newquery.getHash()));
        }


        for(var i=0;i < $rootScope.historyQueries.length;i++)
        {
            $rootScope.currentQueries.push($rootScope.historyQueries[i].query);
        }



        if($rootScope.currentQueries.indexOf(newquery.query) == -1) {


            $rootScope.historyQueries.reverse();
            $rootScope.historyQueries.push(new SearchHistoryItem(newquery.query, newquery.getHash()));

            $rootScope.historyQueries.reverse();
        }
        else
        {
            var index =  $rootScope.historyQueries.map(function (item) {
                return item.query;
            }).indexOf(newquery.query);

            $rootScope.historyQueries.splice(index,1);

            $rootScope.historyQueries.reverse();
            $rootScope.historyQueries.push(new SearchHistoryItem(newquery.query, newquery.getHash()));

            $rootScope.historyQueries.reverse();
        }

    };

    /**
     * Load the specified query into the view.
     * @param QueryIndex The index of the query object in the queries list.
     * @todo complete this function
     */
    $scope.setQuery = function(QueryIndex) {
        if (QueryIndex >= 0 && QueryIndex <= $scope.queries.length) {
            var query = $scope.queries[QueryIndex];
            if (query) {
                // set the query in the search service, then force it to update
            }
        }
    };

    /**
     * Add the selected facet to the facet constraint list.
     * @param $event Event
     * @param Index Index of user selected facet. This facet will be added to
     * the search list.
     */
    /* $scope.add = function($event, Index) {
     // create a new facet

     var query = $scope.queries[Index];

     var hash = query.getHash();

     $location.path(hash);

     // @see https://github.com/angular/angular.js/issues/1179
     $event.preventDefault();
     };
     */

    $scope.add = function($event, query) {
        // create a new facet


        $location.path(query.hash);

        // @see https://github.com/angular/angular.js/issues/1179
        $event.preventDefault();
    };


    // initialize the controller
    $scope.init();

}

// inject controller dependencies
SearchHistoryController.$inject = ['$scope', '$rootScope','$attrs','$location', 'SolrSearchService'];
