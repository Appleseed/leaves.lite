/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* FieldCheckboxFacetController                                                  */

/**
 * Field checkbox facet controller. Creates controls for checkboxes to be used as part of a facet query
 * 
 * Currently handles Gender facets "M" and "F"
 *
 * @param $scope Controller scope
 * @param $attrs
 * @param $location
 * @param $route
 * @param $routeParams
 * @param $window
 * @param SolrSearchService Solr search service
 */
function FieldCheckboxFacetController($scope, $rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService) {

    // reset $scope.items on handleUpdate()
    $scope.clearItems = false;

    // facet selections are mutually exclusive
    $scope.exclusive = true;

    // the name of the query used to retrieve the list of facet values
    $scope.facetQuery = 'facetQuery';

    // the operator used when joining multiple facet queries
    $scope.facetQueryOperator = 'OR';

    // the list of facets
    $scope.facets = [];

    // the name of the field to facet
    $scope.field = '';

    // TODO: refactor so that genderFacet is not hard coded
    $scope.genderFacet = {
        F: false,
        M: false
    };

    // the list of facet values
    //  Initialize to contain facets with value but no score
    $scope.items = [
        { value:"F", score: null},
        { value:"M", score: null}
    ];

    // the max number of items to display in the facet list
    $scope.maxItems = 300;

    // the name of the search query that we are faceting. we watch this query
    // to determine what to present in the facet list
    $scope.queryName = SolrSearchService.defaultQueryName;

    // a facet value from this set has been selected
    $scope.selected = false;

    // the url to the solr core
    $scope.source = undefined;

    //html tags list
    $scope.htmlTags =[ "a", "abbr", "acronym", "address", "applet", "area", "b", "base", "basefont", "bdo",
        "big", "blockquote", "body", "br", "button", "caption", "center", "cite", "code", "col", "colgroup",
        "dd", "del", "dfn", "dir", "div", "dl", "dt", "em", "embed","fieldset", "font", "form", "frame", "frameset",
        "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input",
        "ins", "isindex", "kbd", "label", "legend", "li", "link", "map","marquee", "menu", "meta", "noframes", "noscript",
        "object", "ol", "optgroup", "option", "p", "param", "pre", "q", "s", "samp", "script", "select", "small",
        "span", "strike", "strong", "style", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
        "thead", "title", "tr", "tt", "u", "ul", "var", "class", "src", "href","page","id"];


    ///////////////////////////////////////////////////////////////////////////

    /**
     * Facet result
     * @param Value
     * @param Score
     */
    function FacetResult(Value, Score) {
        this.value = Value;
        this.score = Score;
    };

    function sortFacets(a, b){
        var aValue = a.value;
        var bValue = b.value;
        if (aValue < bValue) {
            return -1;
        }
        if (aValue > bValue) {
            return 1;
        }
        return 0;
    };

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
        var name = $scope.field;
        // ISSUE #27 replace all space characters with * to ensure that Solr matches
        // on the space value

        //var value = "(" + '"' + $scope.items[Index].value.split(' ').join('*') + '"' + ")";
        // REVIEW: Getting rid of quotes - 12/20/16
        //TODO replace " : " with a "*" and then this operation that replaces " " w/ "*"
        var value = "(" + $scope.items[Index].value.replace(' : ', ' ').split(' ').join('*') + ")";

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

    $scope.change = function($event, Index, items) {
        // create a new facet
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        var name = $scope.field;

        // remove Chosen options that were manually created based on hash
        jQuery(".temp-option").remove();

        var values = "(";
        for(var i in items){
            var operator = "";
            if(items.length>1) 
                operator = $scope.facetQueryOperator;
            // replace special characters with a space, then where there are two or more spaces, replace with a single space
            
            if(items[i] == true) {
                var value = operator+"(" + i + ")";
            } else {
                continue;
            }
            values+=value;
        }
        values+=")";
        var facet = query.createFacet(name, values);
        var emptyFacet = query.createFacet(name,""); // for removal
        
        // if values is empty clear the facet query parameter
        if (values == "()") {
            query.addFacet(emptyFacet);
        } else {
            query.addFacet(facet);
        }

        // Removes query option "clear" before page refresh
        query.removeOption("clear");

        var hash = query.getHash();
        $location.path(hash);
        // @see https://github.com/angular/angular.js/issues/1179
        //$event.preventDefault();
    };

    /**
     * Handle update event. Get the query object then determine if there is a
     * facet query that corresponds with the field that this controller is
     * targeting.
     */
    $scope.handleUpdate = function() {
        if ($scope.clearItems == true) {
            // clear current results
            $scope.items = [];
        }
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
                var facet_fields = results.facet_fields[$scope.field].splice($scope.maxItems,results.facet_fields[$scope.field].length);
            } else {
                var facet_fields = results.facet_fields[$scope.field];
            }
            // add facets to the item list if they have not already been
            // selected

            // TODO: if $scope.clearItems = false, the count will not update.  Find a way
            //  to update $scope.items.count if $scope.items.value exists.
            if ($scope.items.length == 0) {
                for (i=0; i< facet_fields.length; i+=2) {
                    var value = results.facet_fields[$scope.field][i];
                    var count = results.facet_fields[$scope.field][i+1];
                    var facet = new FacetResult(value,count);
                    if($scope.htmlTags.indexOf(facet.value)=== -1) {
                        $scope.items.push(facet);
                    }
                }
            }

            $scope.items.sort(sortFacets);
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

            var facetResults = query.getFacet($scope.field);
            if (query.getOption("clear") == "true" || facetResults == undefined) {
                // uncheck checkboxes when results are cleared or no gender facets in query
                for (var object in $scope.genderFacet) {
                    $scope.genderFacet[object] = false;
                }
            } else {
                for (var object in $scope.genderFacet) {
                    // for saved states - check checkboxes for facets found in query
                    if (facetResults.value.indexOf(object) > 0) {
                        $scope.genderFacet[object] = true;
                    }
                }
            }

            

            query.setOption("facet", "true");
            query.setOption("facet.field", $scope.field);
            //query.setOption("facet.limit", $scope.maxItems);
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
FieldCheckboxFacetController.$inject = ['$scope', '$rootScope', '$attrs', '$location', '$route', '$routeParams', '$window', 'SolrSearchService'];
