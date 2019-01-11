/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* FacetClearSelectionController                                                  */

/**
 * Facet field clear selection controller.  Clears selected facets from query.
 * 
 * @param $scope Controller scope
 * @param $attrs
 * @param $location
 * @param $route
 * @param $routeParams
 * @param $window
 * @param SolrSearchService Solr search service
 */
function FacetClearSelectionController($scope, $rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService) {

  // facets
  $scope.items = [];

  // URL to Solr core
  $scope.source = undefined;

  // target query name
  $scope.target = SolrSearchService.defaultQueryName;

  ///////////////////////////////////////////////////////////////////////////

  /**
   * @param field is the field name the facet belongs to.
   * @param index is the index of the qFR you want to stringify.
   * 
   * @return is the stringified index parameters to be passed as a query option.
   */

  function stringifyQFR(field, index) {
    return "dFR[" + field + "][" + index + "]";
  }

  //Removes all applied facets from hash
  $scope.clearFilters = function () {

    var hash = ($routeParams.query || "");
    var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
    if (query == undefined) {
      query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);

    }

    query.clearFacets();

    /*
    // Fields should be the list of fields
    var fields = [];
    for (var field in fields) {
        var option = "";
        for (var i = 0; option != undefined; i++) {
            option = query.getOption(stringifyQFR(fields[field], i));
            if (option == undefined) break;
            query.removeOption(stringifyQFR(fields[field], i));
        }
    }*/

    // Removing any qFR (i.e. dFR) options from the query hash
    for (var option in query.options) {
      //var optionString = option.toString();
      if (option.match(/dFR\[.*\]/)) {
        query.removeOption(option);
      }
    }

    // remove options that were manually created based on hash
    jQuery(".temp-option").remove();

    // Resets pagination
    query.removeOption("start");

    query.setOption("clear", "true");

    SolrSearchService.setQuery($scope.target, query);
    SolrSearchService.updateQuery($scope.target);

    hash = query.getHash();
    $location.path(hash);

    parent.location.hash = "&q=*:*";
    window.location.reload();
  };


  /**
   * Remove the facet constraint from the target query.
   * @param Index Index of facet in the list
   */
  $scope.remove = function (Index) {
    var query = SolrSearchService.getQuery($scope.target);
    query.removeFacetByIndex(Index);
    // change window location
    var hash = query.getHash();
    $location.path(hash);
  };

  /**
   * Update the controller state.
   */
  $scope.handleUpdate = function () {
    var hash = ($routeParams.query || "");
    var query = SolrSearchService.getQueryFromHash(hash, $rootScope.appleseedsSearchSolrProxy);
    if (query) {
      $scope.items = query.getFacets();
    }
  };

  /**
   * Initialize the controller
   */
  $scope.init = function () {
    // apply configured attributes
    for (var key in $attrs) {
      if ($scope.hasOwnProperty(key)) {
        $scope[key] = $attrs[key];
      }
    }
    // update the list of facets on route change
    $scope.$on("$routeChangeSuccess", function () {
      $scope.handleUpdate();
    });
  };

  // initialize the controller
  $scope.init();

}

// inject controller dependencies
FacetClearSelectionController.$inject = ['$scope', '$rootScope', '$attrs', '$location', '$route', '$routeParams', '$window', 'SolrSearchService'];
