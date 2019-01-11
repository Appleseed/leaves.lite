/**
 * Created by Anant on 5/13/2016.
 */
/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* DatePickerFacetController                                                  */

/**
 * 
 *
 * @param $scope Controller scope
 * @param $attrs
 * @param $location
 * @param $route
 * @param $routeParams
 * @param $window
 * @param SolrSearchService Solr search service
 */
function DatePickerFacetController($scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService) {



    // start date
    $scope.startDate = undefined;

    // end date
    $scope.endDate = undefined;


    // facet selections are mutually exclusive
    $scope.exclusive = true;


    // the list of facets
    $scope.facets = [];

    // the name of the field to facet
    $scope.field = 'createdDate';

    // the list of facet values
    $scope.items = [];


    // the name of the search query that we are faceting. we watch this query
    // to determine what to present in the facet list
    $scope.queryName = SolrSearchService.defaultQueryName;

    // a facet value from this set has been selected
    $scope.selected = false;

    // the url to the solr core
    $scope.source = $rootScope.appleseedsSearchSolrProxy;

    //
    $scope.dateRangeQuery = 'dateRangeQuery';

    //StartDate timestamp (default)
    $scope.startTime = 'T23:59:59.999Z';

    //EndDate timestamp (default)
    $scope.endTime = 'T00:00:00Z';

    // target query name
    $scope.target = SolrSearchService.defaultQueryName;

    //facets
    $scope.facets = [];

    //$scope.warn =  undefined;


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




    $scope.submit = function() {

        var startDate = new Date(jQuery('#sDate').val());
        $scope.startDate = startDate.getFullYear() + '-' + ("0" + (startDate.getMonth() + 1)).slice(-2) + '-' + ("0" + startDate.getDate()).slice(-2);

        var endDate = new Date(jQuery('#eDate').val());
        $scope.endDate = endDate.getFullYear() + '-' + ("0" + (endDate.getMonth() + 1)).slice(-2) + '-' + ("0" + endDate.getDate()).slice(-2);

        if ($scope.startDate <= $scope.endDate) {

            var hash = ($routeParams.query || undefined);
            if (hash) {
                var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
            } else {
                query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
            }

            query.removeFacet('+createdDate');
            query.setOption("fq", $scope.field +":[" +  $scope.startDate +  $scope.startTime + " TO " +  $scope.endDate +  $scope.startTime + "]");
            //query.setOption("sort",$scope.field);
            query.setOption("rows", "0");
            query.setOption("wt", "json");
            SolrSearchService.setQuery($scope.dateRangeQuery, query);
            SolrSearchService.updateQuery($scope.dateRangeQuery);

            var hash = query.getHash();
            $location.path(hash);

        } else {
            // set the values back to the prior state
            //$scope.endDate = $scope._endDate;
            //$scope.startDate = $scope._startDate;
            //$log.info("WARNING: start date is greater than end date");
            //$scope.warn = "Start Date can't > End date";
            alert("Start Date can't be later than End date");
        }
    };


    // initialize the controller
    //$scope.init();



}

// inject dependencies
DatePickerFacetController.$inject = ['$scope','$rootScope', '$attrs', '$location', '$route', '$routeParams', '$window', 'SolrSearchService'];
