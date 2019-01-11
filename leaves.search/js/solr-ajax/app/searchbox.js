/**
 * This file is subject to the terms and conditions defined in the
 * 'LICENSE.txt' file, which is part of this source code package.
 */

'use strict';

/*---------------------------------------------------------------------------*/
/* Application                                                               */

var app = angular.module('solr-ajax',['ngRoute','SearchHints','Solr','TextFilters','Utils']);

/**
 * Define application routes.
 * @see http://www.bennadel.com/blog/2420-Mapping-AngularJS-Routes-Onto-URL-Parameters-And-Client-Side-Events.htm
 */
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/:query', { event: "/query" }).
        otherwise({ event: "/" });
}])
.run(function($rootScope) {
	$rootScope.appleseedsSearchSolrProxy = "https://ss346483-us-east-1-aws.searchstax.com/solr/leaves_anant_stage";
});

