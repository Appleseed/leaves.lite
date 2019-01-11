/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* AutoComplete                                                              */

var module = angular.module('Autocomplete', []);

/**
 * Directive to add JQuery UI AutoComplete to element
 * @see http://jqueryui.com/autocomplete/
 */
module.directive('searchhints', function() {
    return {
        restrict: "A",
        link: function(scope, element) {
            element.autocomplete({
                delay: 500,
                minLength: 3,
                source: function(request, response) {
                    var results = jQuery.ui.autocomplete.filter(scope.hints, request.term);
                    response(results.slice(0, 10));
                }
            });
        }
    }
});

/**
 * searchbox attribute provides a JQuery UI based autocomplete, search hints
 * drop down box. The box is populated with search hints from the parent
 * searchbox element scope.
 */
module.directive('searchbox', function() {
    return {
        link: function(scope, element, attrs) {
            // update the user query
            element.bind("keyup", function(event) {
                if (event.keyCode == 13) {
                    // enter key: submit query
                    if (scope.userquery != '') {
                        scope.handleSubmit(scope.userquery);
                    }
                } else {
                    // all other keys: update user query
                    scope.userquery = event.target.value;
                }
           });
            // display autocomplete hints
            element.autocomplete({
                delay: 500,
                minLength: 3,
                source: function(request, response) {
                    // @todo execute a query against the index on the fly
                    var results = jQuery.ui.autocomplete.filter(scope.hints, request.term);
                    response(results.slice(0, 10));
                }
            });
        },
        restrict: "A",
        scope: false
    }
});

/**
 * searchbutton attribute attaches a click handler to the button element that
 * calls the searchbox parent scope submit() method.
 */
module.directive('searchbutton', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind("click", function() {
                if (scope.userquery != '') {
                    scope.handleSubmit(scope.userquery);
                }
            });
        },
        restrict: "A",
        scope: false
    }
});
