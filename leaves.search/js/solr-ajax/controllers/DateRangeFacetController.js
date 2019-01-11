/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* DateRangeFacetController                                                  */

/**
 * Date range facet controller filters a query by various date ranges.
 * 
 * @param $scope Controller scope
 * @param $attrs
 * @param $location
 * @param $route
 * @param $routeParams
 * @param $window
 * @param SolrSearchService Solr search service
 */
function DateRangeFacetController($scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService) {

    // facet selections are mutually exclusive
    $scope.exclusive = true;

    // the name of the query used to retrieve the list of facet values
    $scope.facetQuery = 'facetQuery';

    // the list of facets
    $scope.facets = [];

    // the name of the field to facet
    $scope.field = '';

    // the list of facet values
    $scope.items = [];

    // the max number of items to display in the facet list
    $scope.maxItems = 7;

    // the name of the search query that we are faceting. we watch this query
    // to determine what to present in the facet list
    $scope.queryName = SolrSearchService.defaultQueryName;

    // a facet value from this set has been selected
    $scope.selected = false;

    // the url to the solr core
    $scope.source = $rootScope.appleseedsSearchSolrProxy;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Facet result
     * @param Value
     * @param Score
     */
    function FacetResult(Value, Score) {
        this.value = Value;
        this.score = Score;
    }

    /**
     * Add the selected facet to the facet constraint list.
     * @param $event Event
     * @param Index Index of user selected facet. This facet will be added to
     * the search list.
     */
    $scope.add = function($event, Index) {
        // create a new facet
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        query.solr = $rootScope.appleseedsSearchSolrProxy;
        // Resets pagination
        query.removeOption("start");
        var name = $scope.field;
        // ISSUE #27 replace all space characters with * to ensure that Solr matches
        // on the space value
        // Removing star for this date range 
        var date_value = $scope.items[Index].value.split(":").join('\\:');//.split(' ').join('*');
        var value = "(" + date_value + ")";
        var facet = query.createFacet(name, value);
        // check to see if the selected facet is already in the list
        if ($scope.facets.indexOf(facet) == -1) {
            query.addFacet(facet);
            // change window location
            var hash = query.getHash();
            $location.path(hash);
        }
        // @see https://github.com/angular/angular.js/issues/1179
        $event.preventDefault();
    };

    /**
     * Handle update event. Get the query object then determine if there is a
     * facet query that corresponds with the field that this controller is
     * targeting.
     */
    $scope.handleUpdate = function() {
        // clear current results
        $scope.items = [];
        $scope.selected = false;
        var selected_values = [];
        // get the starting query
        var hash = ($routeParams.query || undefined);
        if (hash) {
            var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
        } else {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        // if there is an existing query, find out if there is an existing
        // facet query corresponding to this controller's specified facet
        // field. if there is a match then set that value as selected in
        // our list
        var facets = query.getFacets();
        for (var i=0; i<facets.length; i++) {
            var f = facets[i];
            if (f.field.indexOf($scope.field) > -1) {
                $scope.selected = true;
                var s = f.value.replace(/([\(\[\)\]])+/g,"");
                selected_values.push(s);
                // break;
            }
        }
        // get the list of facets for the query
        var facet_query = SolrSearchService.getQuery($scope.facetQuery);
        var results = facet_query.getFacetCounts();
        if (results && results.hasOwnProperty('facet_queries')) {
            // trim the result list to the maximum item count
            //if (results.facet_queries[$scope.field].length > $scope.maxItems * 2) {
            //    var facet_queries = results.facet_queries[$scope.field].splice(0,$scope.maxItems);
            //} else {
                var facet_queries = results.facet_queries;
                
            //}
            // add facets to the item list if they have not already been
            // selected
            var count = 0;
            for (var prop in facet_queries) {
            	++count;
            	var queryKey = prop;
                var value = results.facet_queries[queryKey];
                
                if (selected_values.indexOf(value) == -1) {
                    var count = value;
					queryKey = queryKey.replace($scope.field+":","");
                	var facet = new FacetResult(queryKey,count);
                    $scope.items.push(facet);
                }
            }
        }
    };

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
        // handle facet list updates
        $scope.facetQuery = $scope.field + "Query";
        $scope.$on($scope.facetQuery, function () {
            $scope.handleUpdate();
        });
        // update the list of facets on route change
        $scope.$on("$routeChangeSuccess", function() {
            // create a query to get the list of facets
            var hash = ($routeParams.query || undefined);
            if (hash) {
                var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
            } else {
                query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
            }
            query.solr = $rootScope.appleseedsSearchSolrProxy;
            query.setOption("facet", "true");
            //query.setOption("facet.field", $scope.field);
            query.setOption("facet.limit", $scope.maxItems);
            //added to do adhoc facets. also includes a change in solr.js where 
            // the query creator appends each of them into facet.query 
            query.setOption("facet.query1", $scope.field+":[NOW-6MONTHS TO NOW]");
            query.setOption("facet.query2", $scope.field+":[NOW-3MONTHS TO NOW]");
            query.setOption("facet.query3", $scope.field+":[NOW-2MONTHS TO NOW]");
            query.setOption("facet.query4", $scope.field+":[NOW-1MONTH TO NOW]");
            query.setOption("facet.mincount", "1");
            query.setOption("facet.sort", "count");
            query.setOption("rows", "0");
            query.setOption("wt", "json");
            SolrSearchService.setQuery($scope.facetQuery, query);
            SolrSearchService.updateQuery($scope.facetQuery);
        });
    };

    // initialize the controller
    $scope.init();

}

// inject dependencies
DateRangeFacetController.$inject = ['$scope','$rootScope', '$attrs', '$location', '$route', '$routeParams', '$window', 'SolrSearchService'];