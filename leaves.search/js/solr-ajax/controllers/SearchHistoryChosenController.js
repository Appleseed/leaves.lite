/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* SearchHistoryChosenController                                                   */

/**
 * Search history Chosen controller. Lists the last N user search queries. Takes the
 * form of a queue.  Uses Chosen.
 * @param $scope Controller scope
 * @param SolrSearchService Solr search service
 */
function SearchHistoryChosenController($scope, $rootScope, $attrs, $location, SolrSearchService) {
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

        jQuery("#select-chosen-search-history").chosen({disable_search: true});

        // Handle update events from the search service.
        $scope.$on($scope.queryName, function() {
            $scope.handleUpdate();
        });
    };

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
        $scope.queries = $rootScope.historyQueries;
        for (var j in $scope.queries) {
            jQuery("#select-chosen-search-history").append('<option" value="' + $scope.queries[j].query + '">' + $scope.queries[j].query + '</option>').trigger("chosen:updated");
        }
    };

    /**
     * Load the specified query into the view.
     * @param QueryIndex The index of the query object in the queries list.
     * @todo complete this function -- leftover from SearchHistoryController.js
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
     * @param query
     */

    $scope.add = function(query) {
        // create a new facet

        $location.path(query.hash);

        // @see https://github.com/angular/angular.js/issues/1179
        //$event.preventDefault();
    };

    // initialize the controller
    $scope.init();

}

// inject controller dependencies
SearchHistoryChosenController.$inject = ['$scope', '$rootScope','$attrs','$location', 'SolrSearchService'];
