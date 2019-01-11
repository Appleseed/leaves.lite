
'use strict';

/*---------------------------------------------------------------------------*/
/* FieldAlphaFilterFacetController                                                   */

/**
 * Alpha Field Facet Filter controller. It renders an A-Z filter which is then tied to the search query.
 * @param $scope Controller scope
 * @param SolrSearchService Solr search service
 */
function FieldAlphaFilterFacetController($scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService) {
    // $scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService
    //ori ($scope, $attrs, SolrSearchService)
    // parameters

    // the alphabet 
    var str = "abcdefghijklmnopqrstuvwxyz";
    $scope.alphabet = str.toUpperCase().split("");

    // the active letter    
    $scope.activeLetter = '';

    // the name of the query used to retrieve the list of facet values
    $scope.facetQuery = 'alphaFilterQuery';

    // the name of the field to filter
    $scope.field = '';

    // the list of facets
    $scope.facets = [];

    // the name of the search query that we are faceting. we watch this query
    // to determine what to present in the facet list
    $scope.queryName = SolrSearchService.defaultQueryName;

    // a facet value from this set has been selected
    $scope.selected = false;

    // the url to the solr core
    $scope.source = undefined;

    /**
     * Set the active letter (used for showing which one is selected)
     * @param Index Index of user selected filter. 
     */
    $scope.setActiveLetter = function(letter) {
        $scope.activeLetter = letter;
    }

    /**
     * Clear the filter 
     */
    $scope.clearFilter = function($event){
        // clear the selected letter
        $scope.selected = false;
        $scope.setActiveLetter('');

         // create a new facet
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        
        var name = $scope.field;
        $scope.facets = query.getFacets();
        var facets = $scope.facets;
        //console.dir(facets);
        for (var i=0;i<facets.length;i++) {
            // if you found the same field here before, remove it
            if (facets[i].field == name) {
                query.removeFacetByIndex(i);
            } 
        }
        
        // change window location
        var hash = query.getHash();
        $location.path(hash);
        if ($event) {
            $event.preventDefault();
        }
    }

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
     * Add the filter to the query 
     * @param $event Event
     * @param Index Index of user selected filter.
     */
    $scope.filterByLetter = function($event, Index) {

        // activate the selected letter
        $scope.selected = true;
        $scope.setActiveLetter(Index);

        // create a new facet
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        
        var name = $scope.field;
        
        // REVIEW - use a wildcard to filter values 
        var value = "(" + Index + "*)";

        $scope.facets = query.getFacets();
        var facets = $scope.facets;

        // our new facet 
        var facet = query.createFacet(name, value);
        // index of the facet 
        var facetIndex = $scope.facets.indexOf(facet);
        
        // Resets pagination
        query.removeOption("start");

        if (facetIndex == -1) {
            // REVIEW - for some reason the indexOf above is not detecting so walking through this manually
            for (var i=0;i<facets.length;i++) {
                // if you found the same field here before, remove it
                if (facets[i].field == facet.field) {
                    query.removeFacetByIndex(i);
                } 
            }
            // add a new facet 
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
        if (results && results.hasOwnProperty('facet_fields')) {
            // trim the result list to the maximum item count
            if (results.facet_fields[$scope.field].length > $scope.maxItems * 2) {
                var facet_fields = results.facet_fields[$scope.field].splice(0,$scope.maxItems);
            } else {
                var facet_fields = results.facet_fields[$scope.field];
            }
        }
        $scope.facets = query.getFacets();
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

            if (query.getOption("clear") == "true" || query.getFacet($scope.field) == undefined) {
                $scope.clearFilter();
            }
            
            query.setOption("facet", "true");
            query.setOption("facet.field", $scope.field);
            //query.setOption("facet.limit", $scope.maxItems);
            query.setOption("facet.mincount", "1");
            //query.setOption("facet.sort", "count");
            query.setOption("rows", "0");
            query.setOption("wt", "json");
            SolrSearchService.setQuery($scope.facetQuery, query);
            SolrSearchService.updateQuery($scope.facetQuery);

            $scope.facets = query.getFacets();
        });
    };

    // initialize the controller
    $scope.init();

}

// inject controller dependencies
FieldAlphaFilterFacetController.$inject = ['$scope', '$rootScope', '$attrs', '$location', '$route', '$routeParams', '$window', 'SolrSearchService'];
