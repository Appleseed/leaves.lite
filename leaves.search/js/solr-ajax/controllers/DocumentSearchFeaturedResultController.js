/**
 * Created by Anant on 5/5/2016.
 */
/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* DocumentSearchResultsController                                           */

/**
 * Presents search results for a named query.
 * @param $scope
 * @param $attrs
 * @param $location
 * @param $route
 * @param $routeParams
 * @param $window
 * @param SolrSearchService
 * @param Utils
 */
function DocumentSearchFeaturedResultController($scope, $sce, $rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService, Utils) {

    // document search results
    $scope.documents = [];

    // the number of search results to display per page
    //$scope.documentsPerPage = 10;

    // flag for when the controller has submitted a query and is waiting on a
    // response
    $scope.loading = false;

    // the current search result page
    //$scope.page = 0;

    // list of pages in the current navigation set plus prev and next
    // $scope.pages = [];

    // list of pages in the current navigation set
    // $scope.pagesOnly = [];

    // the number of pages in a navigation set
    //$scope.pagesPerSet = 10;

    // the query name
    $scope.queryName = SolrSearchService.defaultQueryName;

    // url to solr core
    $scope.source = undefined;

    // zero based document index for first record in the page
    //$scope.start = 0;

    // count of the total number of result pages
    //$scope.totalPages = 1;

    // count of the total number of search results
    //$scope.totalResults = 0;

    // count of the number of search result sets
    //$scope.totalSets = 1;

    // update the browser location on query change
    $scope.updateLocationOnChange = true;

    // user query
    $scope.userquery = '';

    // the name of the field to featured
    $scope.field = '';

    // the name of the query used to retrieve the list of featured values
    $scope.featuredQuery = 'featuredQuery';

    ///////////////////////////////////////////////////////////////////////////

    /**
     * A page in a pagination list
     * @param Name Page name
     * @param Num Page number
     */
    /*   function Page(Name,Num) {
     this.name = Name;
     this.number = Num;
     this.isCurrent = false;
     }*/

    /**
     * Set the results page number.
     * @param Start Index of starting document
     */
    /* $scope.handleSetPage = function(Start) {
     var query = SolrSearchService.getQuery($scope.queryName);
     query.setOption('start', Start * $scope.documentsPerPage);
     if ($scope.updateLocationOnChange) {
     var hash = query.getHash();
     $location.path(hash);
     $window.scrollTo(0, 0);
     } else {
     $scope.loading = true;
     SolrSearchService.updateQuery($scope.queryName);
     }
     };
     */
    /**
     * Update the controller state.
     */
    $scope.handleUpdate = function() {
        // clear current results
        $scope.documents = [];

        $scope.loading = false;
        // get new results
        var results = SolrSearchService.getResponse($scope.featuredQuery);
        var hlResults = SolrSearchService.getHighlighting($scope.featuredQuery);
        var mltResults = SolrSearchService.getMoreLikeThis($scope.featuredQuery);

        //var query = SolrSearchService.getQueryFromHash($scope.query, $rootScope.appleseedsSearchSolrProxy);
        //// if there is a data source specified, override the default
        //if ($scope.source) {
        //    query.solr = $scope.source;
        //}
        var query = SolrSearchService.getQuery($scope.queryName);
        if(query.query!=='*:*') {

            if (results && results.docs) {


                for (var i = 0; i < results.docs.length; i++) {
                    // clean up document fields

                    results.docs[i].moreLikeThis = mltResults[results.docs[i].id];

                    if (hlResults[results.docs[i].id].content !== undefined) {

                        results.docs[i].highlights = hlResults[results.docs[i].id];


                        $sce.trustAsHtml(results.docs[i].highlights.content[0]);
                        // add to result list

                    }


                    $scope.documents.push(results.docs[i]);
                }
            } else {
                $scope.documents = [];

            }
        }
        // update the page index

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
        // handle featured list updates
        $scope.featuredQuery = $scope.field + "Query";
        $scope.$on($scope.featuredQuery, function () {
            $scope.handleUpdate();
        });
        // update the list of featureds on route change
        $scope.$on("$routeChangeSuccess", function() {
            // create a query to get the list of featureds
            var hash = ($routeParams.query || undefined);
            if (hash) {
                var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
            } else {
                query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
            }
            query.setOption("hl","true");
            query.setOption("mlt","true");
            query.setOption("mlt.fl","title,smartKeywords");
            //query.setOption("rows", "50");
            query.setOption("fq","source:"+ $scope.field);          
            query.setOption("start","0");
            SolrSearchService.setQuery($scope.featuredQuery, query);
            SolrSearchService.updateQuery($scope.featuredQuery);
        });
    };


    // initialize the controller
    $scope.init();

}

// inject controller dependencies
DocumentSearchFeaturedResultController.$inject = ['$scope','$sce', '$rootScope', '$attrs', '$location', '$route', '$routeParams', '$window', 'SolrSearchService', 'Utils'];
