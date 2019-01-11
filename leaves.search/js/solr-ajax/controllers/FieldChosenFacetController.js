
'use strict';

/*---------------------------------------------------------------------------*/
/* FieldChosenFacetController                                                   */

/**
 * Chosen Field Facet Controller. It renders a Chosen.js dropdown / selection box as needed. 
 * @param $scope Controller scope
 * @param SolrSearchService Solr search service
 */
function FieldChosenFacetController($scope,$rootScope, $attrs, $location, $q, $timeout, $route, $routeParams, $window, SolrSearchService) {
    // $scope,$rootScope, $attrs, $location, $route, $routeParams, $window, SolrSearchService
    //ori ($scope, $attrs, SolrSearchService)
    // parameters

    function facetArrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i].value === a[j].value)
                    a.splice(j--, 1);
            }
        }

        return a;
    }

    function qFRArrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i][0] === a[j][0] && a[i][1] === a[j][1])
                    a.splice(j--, 1);
            }
        }

        return a;
    }

    /**
     * @param field is the field name the facet belongs to.
     * @param index is the index of the qFR you want to stringify.
     * 
     * @return is the stringified index parameters to be passed as a query option.
     */

    function stringifyQFR(field, index) {
        return "dFR[" + field + "][" + index + "]";
    }

    $timeout(function() {
        return $scope.$apply(function() {
            //return $scope.myPets.push('hamster');
        });
    }, 1000);

    var simulateAjax;

    simulateAjax = function(result) {
        var deferred, fn;

        deferred = $q.defer();
        fn = function() {
            return deferred.resolve(result);
        };
        $timeout(fn, 3000);
        
        return deferred.promise;
    };

    simulateAjax(['grooo', 'wowowowow', 'lakakalakakl', 'yadayada', 'insight', 'delve', 'synergy']).then(function(result) {
        return $scope.optionsFromQuery = result;
    });

 
    // facet selections are mutually exclusive
    $scope.exclusive = true;

    // the name of the query used to retrieve the list of facet values
    $scope.facetQuery = 'chosenFacetQuery';

    // the operator used when joining multiple facet queries
    $scope.facetQueryOperator = 'OR';

    // the list of facets
    $scope.facets = [];

    // default selected facets
    $scope.selectedDefault = [];

    // the name of the field to facet
    $scope.field = '';

    // the name of the field to facet
    $scope.fieldPlaceholderText = '';

    // sort facet results by alpha/index (false for default sort by score)
    $scope.alphaSortFacets = false;

    // the list of facet values
    $scope.items = [];

    // the list of chosen facets for applying facets
    $scope.selectedItems = [];

    // the list of chosen facet saved
    $scope.selectedItemsSaved = [];
    
    // the max number of items to display in the facet list
    $scope.maxItems = 300;

    // $scope.qFR will be used as a new way to build facet queries while saving the state of Chosen SELECTs
    $scope.qFR = [];

    // the name of the search query that we are faceting. we watch this query
    // to determine what to present in the facet list
    $scope.queryName = SolrSearchService.defaultQueryName;

    // a facet value from this set has been selected
    $scope.selected = false;

    // the number of elements inside Chosen SELECTS.  Used to determine whether or not to show Chosen.
    $scope.shownItems = 0;

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
    }

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

    // Checks if browser is IE.  Special handling included for IE 11.
    function isIE() {
        var msie = window.navigator.userAgent.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        }
        else {
            return false;
        }
    }

    // function for determining if a facet exists in $scope.items.
    function itemsIndexOf(facetValue) {
        for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].value == facetValue) {
                return i;
            }
        }
        return -1;
    }

    // replace special characters with a space, then where there are two or more spaces, replace with a single space
    function replaceSpecialChars(value) {
        return value.replace(/[\&\:\(\)\[\\\/]/g, ' ').replace(/\s{2,}/g, ' ').split(' ').join('*');
    };

    // function to determine whether or not to show Chosen
    $scope.showItems = function() {
        var tempOptions = document.getElementsByClassName("temp-option");
        if ($scope.items.length >= 1) {
            $scope.shownItems = $scope.items.length;
        } else if ($scope.selectedItems.length >= 1) {
            // $scope.selectedItems may contain items that no longer exist in $scope.items.
            //  These items should be de-selectable in Chosen.
            $scope.shownItems = $scope.selectedItems.length;
        } else {
            $scope.shownItems = -1;
        }
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
            var query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }
        
        // if there is an existing query, find out if there is an existing
        // facet query corresponding to this controller's specified facet
        // field. if there is a match then set that value as selected in
        // our list
        var i = 0;
       
        // get the list of facets for the query
        var facet_query = SolrSearchService.getQuery($scope.facetQuery);
        var results = facet_query.getFacetCounts();
        if (results && results.hasOwnProperty('facet_fields')) {
            
            var facet_fields = results.facet_fields[$scope.field];
            
            for (i=0; i< facet_fields.length; i+=2) {
                var value = results.facet_fields[$scope.field][i];
                var count = results.facet_fields[$scope.field][i+1];
                var facet = new FacetResult(value,count);
                // add regardless - want it all there. 
                if($scope.htmlTags.indexOf(facet.value)=== -1){
                    $scope.items.push(facet);
                }
            
            }
        }

        if ($scope.alphaSortFacets == "true") {
            $scope.items.sort(sortFacets);
        }
        
        //bind the chosen select boxes
        $scope.bindChosenSelectors(true);

        if (document.getElementById("query")) {
            //Clear the text of the searchbox if the value is "*:*"
            if (document.getElementById("query").value == "*:*") {
                document.getElementById("query").value = "";
            }
        }

    };

    /* When the multi-select changes add all items to selectedItems/ refresh list.*/
    $scope.changedValue = function(items) {
        
        //DONE
        //walk through the array 
            //if its there, remove it (means it was there, and the change removes it)
            //its not there, add it 
        // update selectedItems -> triggers applyFacets 
    
        console.dir(items);
        console.dir($scope.selectedItems);

        // remove options that were manually created based on hash
        jQuery(".temp-option").remove();

        for(var i in items){
            //if($scope.selectedItems.length != 0){
                //for(var ci in $scope.selectedItems){

                    //if(items[i].value === $scope.selectedItems[ci].value){
                    //    console.log("same facet so remove");
                    //    $scope.selectedItems.splice(ci,1);
                    //} else {
                    //    console.log("diff facet so keep");
                    //    $scope.selectedItems.push(items[i]);
                    //}
                //}
            //} else {
                $scope.selectedItems.push(items[i]);
            //}
        }
        $scope.selectedItems = facetArrayUnique($scope.selectedItems);
        $scope.applyFacets($scope.selectedItems);

    }   

    /**
     * Add the newly selected items / refresh the facet constraint list.
     * when the selectedItems changes.
     * @param newSelectedItems Newly selected items 
     * @param oldSelectedItems Previously selected items 
     */
    /*$scope.$watch('selectedItems', function(newSelectedItems,oldSelectedItems) {
        $scope.applyFacets(newSelectedItems);
    });*/

    /**
     * Separate applyFacets - applies the selected facets to the hash / query 
     */
    $scope.applyFacets = function(selectedItems){
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }

        var name = $scope.field;
        var emptyFacet = query.createFacet(name,""); // for removal
        if(selectedItems.length==0){
            query.addFacet(emptyFacet);
        } else {
            var values = "(";
            for(var selected in selectedItems){
                var operator = "";
                if(selectedItems.length>1 && selected>0) 
                    operator = $scope.facetQueryOperator;
                // replace special characters with a space, then where there are two or more spaces, replace with a single space
                var value = "(" + replaceSpecialChars(selectedItems[selected].value) + ")";
                
                $scope.qFR.push([name, selectedItems[selected].value]); 

                value = operator+value;
                values+=value;
            }
            values+=")";

            $scope.qFR = qFRArrayUnique($scope.qFR)

            for(var A in $scope.qFR) {
                query.setOption(stringifyQFR($scope.qFR[A][0], A), "[" + replaceSpecialChars($scope.qFR[A][1]) + "]");               
            }

            console.log("Here's $scope.qFR for " + name);
            console.log($scope.qFR);

            var facet = query.createFacet(name, values);
            query.addFacet(facet);
        }

        // Resets pagination
        query.removeOption("start");

        // Removes query option "clear" before page refresh
        query.removeOption("clear");
        
        var hash = query.getHash();
        //console.log(hash);
        //$location.path(hash);
        //$location.path(hash);

        $location.path(hash);

    }

    $scope.bindChosenSelectors = function(refresh, initial){
        //// what normally angular does with select, we are then using chosen 
        setTimeout(function () {
            setTimeout(function () {
                //chill here while the results come back 
                jQuery("#select-chosen-"+$scope.field).chosen({disable_search_threshold: 5, placeholder_text_multiple: $scope.fieldPlaceholderText});
            }, 50);

            if(refresh===true){
                setTimeout(function () {
                    var selectedChosen = [];

                    // insert default facet selections based on attribute selectedDefault
                    if (initial === true) {
                        var query = SolrSearchService.getQuery($scope.queryName);
                        var selectedDefaultArray = $scope.$eval($scope.selectedDefault);
                        for (var i in $scope.items) {
                            for (var ic in selectedDefaultArray) {
                                if ($scope.items[i].value == selectedDefaultArray[ic]) {
                                    selectedChosen.push(i);
                                    $scope.selectedItems.push($scope.items[i]);
                                }
                            }
                        }
                        var count = 0;
                        if (query != undefined) {
                            while (query.getOption(stringifyQFR($scope.field, count))){
                                var facetState = query.getOption(stringifyQFR($scope.field, count));
                                var facetStateString = facetState.substring(1, facetState.length-1);
                                for(var item in $scope.items) {
                                    if (replaceSpecialChars($scope.items[item].value) == facetStateString) {
                                        $scope.selectedItems.push($scope.items[item]);
                                    }
                                }

                                count++;
                            } 
                        }
                        $scope.selectedItems = facetArrayUnique($scope.selectedItems);
                        $scope.applyFacets($scope.selectedItems);
                    } else {
                        // remove options that were manually created
                        jQuery(".temp-"+$scope.field).remove();

                        var qFRCount = 0;
                        for (var qFRIndex in $scope.qFR) {
                            // function will determine if the facet value is in $scope.items
                            if ($scope.field == $scope.qFR[qFRIndex][0] && itemsIndexOf($scope.qFR[qFRIndex][1]) == -1 && selectedChosen.length < $scope.selectedItems.length) {
                                var qFRValue = $scope.items.length + qFRCount;
                                jQuery("#select-chosen-"+$scope.field).append('<option class="temp-option temp-'+$scope.field+'" value="' + qFRValue + '">' + $scope.qFR[qFRIndex][1] + '</option>');
                                selectedChosen.push(qFRValue.toString());
                                qFRCount++;
                            }
                        }

                        // sort Chosen options alphabetically
                        if ($scope.alphaSortFacets == "true") {
                            // reorder options to account for manually created options
                            var options = jQuery("#select-chosen-"+$scope.field+" option");
                            options.sort(function(a,b) {
                                if (a.text > b.text) return 1;
                                if (a.text < b.text) return -1;
                                return 0
                            });

                            jQuery("#select-chosen-"+$scope.field).empty().append(options);
                        }        

                        jQuery("#select-chosen-"+$scope.field+" > option").each(function() {
                            for(var i in $scope.selectedItems){
                                if(this.text === $scope.selectedItems[i].value){
                                    selectedChosen.push(this.value);
                                    //console.log(this.text);
                                }
                            }
                        });

                        jQuery("#select-chosen-"+$scope.field).val(selectedChosen).trigger("chosen:updated");

                    }

                    $scope.showItems();
                }, 50);
            }

        }, 50);
    }

    /*
     * Fill Chosen boxes with data from saved json
     */
    $scope.getSavedJson = function() {
        // clear current results
        $scope.items = [];
        
        var i = 0;
        var results = {};
       
        var locationPrefix = "js/umhs/json/";
        // get stored json
        var jsonFileLocation = locationPrefix + $scope.field + ".json";
        var promise = jQuery.getJSON(jsonFileLocation);
        promise.done(function(data) {
            results = data.facet_counts;
            if (results && results.hasOwnProperty('facet_fields')) {
            
                var facet_fields = results.facet_fields[$scope.field];
                
                for (i=0; i< facet_fields.length; i+=2) {
                    var value = results.facet_fields[$scope.field][i];
                    var count = results.facet_fields[$scope.field][i+1];
                    var facet = new FacetResult(value,count);
                    // add regardless - want it all there. 
                    if($scope.htmlTags.indexOf(facet.value)=== -1){
                        $scope.items.push(facet);
                    }
                }
            }

            /*if ($scope.fieldAlphaSort.indexOf($scope.field) > -1 ) {
                $scope.items.sort(sortFacets);
            }*/
        
            //bind the chosen select boxes
            $scope.bindChosenSelectors(true);
        });
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
        // handle facet list updates
        if (isIE() == false) {
            // get JSON from stored files.  Skip this if browser is any version of IE.
            //$scope.getSavedJson();
        }
        $scope.facetQuery = $scope.field + "Query";
        $scope.$on($scope.facetQuery, function () {
            $scope.handleUpdate();
        });

        //bind the chosen select boxes
        $scope.bindChosenSelectors(true, true);
        
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
                $scope.selectedItems = [];
                $scope.qFR = [];
            }

            // tag a facet to be excluded from the filter; ie. don't filter values based on the tagged facet
            if ($scope.exclusive == "false") {
                query.setOption("facet.field", "{!ex=exclude}" + $scope.field);
                var taggedFacet = query.getFacet($scope.field);
                if (taggedFacet != undefined) {
                    taggedFacet.field = "{!tag=exclude}" + taggedFacet.field;
                }
            } else {        
                query.setOption("facet.field", $scope.field);
            }

            //query.setUserQuery("*:*");
            query.setOption("facet", "true");
            //query.setOption("facet.limit", $scope.maxItems);
            query.setOption("facet.mincount", "1");
            //query.setOption("facet.sort", "count");
            query.setOption("rows", "0");
            query.setOption("wt", "json");
            SolrSearchService.setQuery($scope.facetQuery, query);
            SolrSearchService.updateQuery($scope.facetQuery);

            $scope.showItems();

        });

    };

    // initialize the controller
    $scope.init();

    // empties the Chosen <select> of deselected facets                    
    jQuery("#select-chosen-"+$scope.field).on('change', function(event, params){
        if (params.deselected != undefined){
        var query = SolrSearchService.getQuery($scope.queryName);
        if (query == undefined) {
            query = SolrSearchService.createQuery($rootScope.appleseedsSearchSolrProxy);
        }

            var deselected = params.deselected;

            // gets the text of the deselected option from the full list of options of the Chosen <SELECT>
            var deselectedText = jQuery("#select-chosen-"+$scope.field +" > option[value='"+deselected+"']")[0].text;
            var deselectedIndex =  -1;
            //console.log("Deselected: " + deselected + " Deselected text: " + deselectedText);

            // loop through the array of objects, searching for the index where object.value matches the deselected text
            for(var i = 0, len = $scope.selectedItems.length; i < len; i++) {
                if ($scope.selectedItems[i].value === deselectedText) {
                    deselectedIndex = i;
                    break;
                }
            }
            $scope.selectedItems.splice(deselectedIndex, 1);  

            var deselectedIndexFQR =  -1;

            // remove all qFR options
            //  $scope.qFR[i][0] should be the same as $scope.field
            for(var i = 0, len = $scope.qFR.length; i < len; i++) {
                var option = query.getOption(stringifyQFR($scope.qFR[i][0], i));
                if (option == undefined) break;
                query.removeOption(stringifyQFR($scope.qFR[i][0], i));

                // loop through the array, searching for the index where $scope.qFR[i][1] matches the deselected text
                if ($scope.qFR[i][1] === deselectedText) {
                    deselectedIndexFQR = i;
                }
            }

            // remove the deselected option
            $scope.qFR.splice(deselectedIndexFQR, 1);

            // reconstruct the qFR options to match $scope.qFR.
            for(var g = 0, len = $scope.qFR.length; g < len; g++) { 
                query.setOption(stringifyQFR($scope.qFR[g][0], g), "[" + replaceSpecialChars($scope.qFR[g][1]) + "]");
            }

        }
    });

    return $scope.disabled = true;
}

// inject controller dependencies
FieldChosenFacetController.$inject = ['$scope', '$rootScope', '$attrs', '$location', '$q','$timeout', '$route', '$routeParams', '$window', 'SolrSearchService'];
