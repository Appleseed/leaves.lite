
# How to add / remove fields from Search Results

To add or remove fields from your list of search results, open the appropriate html page and search for ``class="results"``.  The contents within the ``<div>`` of this class should contain the fields and html elements regarding search results.  These results are created and controlled by the Angular controller, DocumentSearchResultsController.  Each result is an object, ``doc``, and each object contains many fields that are defined by your Solr index.

To add a field, add an Angular expression of the object's property to the page, plus additional elements that will display your field. Use the other elements in the page as reference.
    eg. ``<p>{{doc.name}}</p>`` to add the field "name" of the respective search result.

To remove a field, exlpore the ``<div>`` container for the field you are looking to delete, and remove the Angular expression plus any related elements,
    eg. You can delete ``<p>{{doc.location}}</p>`` so the "location" field no longer appears in your search results.


# How to add / edit fields with selected / deselected facets

1. Create a new SolrSearchService service instance in a new variable, eg.  ``var query = SolrSearchService.getQuery($scope.queryName)``
2. Create the facet using the function _query.createFacet(Name, Value)_. Parameter _Name_ will be the field name, eg. "Location", while _Value_ will be the facet(s), eg. "Washington, D.C.".
3. Use the function _query.addFacet(Facet)_ to add a facet to the query.
    * TO EDIT: If a facet with the same _Name_ already exists, it will be edited with the new _Value_.
    * TO DELETE: If a facet with the same _Name_ already exists AND it has an empty _Value_ string "", it will remove the facet and field from the query.
4. Make sure that the $location.path gets updated with your query hash to refresh the page and apply the facet query to your results, eg. ``$location.path(query.getHash)``


Some things to note:
* SolrSearchService is defined in the solr.js file.
* Related functions are also defined in the solr.js file.
* Facets should be formatted to remove special characters and clean up dates.  Controllers have functions that will do this for you.
* Some controllers will accept and format multiple facets to be added to a facet query for a single field, such as FieldChosenFacetController.  These will also need to be formatted appropriately.


# Overview of Views 

## documents.html ##
documents.html is a demo page that contains many elements that use different controllers, and utilizes limited styling.  Use this page to test how controllers work, and how search results are filtered.

## searchbox.html ##
searchbox.html is a demo page that is strictly for testing searchbox functionality and related controllers.  It does not have any facet filters and utilizes limited styling.  Use this page to make sure that search results are populated with expected results.

# Overview of Service (solr.js)
solr.js is the javascript file that handles Solr search requests.  This includes query creation, facet creation, and attribute retrival from Solr objects.  The file can be located in ``app\js\solr-ajax\services\solr.js``.

Important variables: 
    _self.excludeFromHash_ - an array of strings that should be excluded from the hash of the URL

Important functions:
* _self.addFacet(Facet)_ - Add facet constraint if it does not already exist, or updates it if it does.
* _self.createFacet(Name, Value)_ - Create a new facet.
* _self.getFacet(Name)_ - Get facet by name. Returns null if the facet could not be found.
* _self.getHash()_ - Get the hash portion of the query URL.
* _self.getOption(Name)_ - Get option value.
* _self.getQuery(ForSolr)_ - Get the query portion of the URL.
* _self.getSuggestions()_ - Get the suggestions object.
* _self.getUserQuery()_ - Get the user query value. i.e. get the search value.
* _self.removeFacet(Name)_ - Remove facet by name.
* _self.removeOption(Name)_ - Remove a query option by name.
* _self.setNearMatch(nearMatch)_ - Set the near matching option.
* _self.setOption(Name,Value)_ - Set option. User queries should be set using the setUserQuery() and setUserQueryOption() functions.
* _self.setUserQuery(Query)_ - Set the user query. i.e. set the search value.

SolrSearchService: 
Used for managing and executing queries against an Apache Solr/Lucene search index. The service provides shared search configuration for multiple controllers in the form of named queries, and a broadcast service to announce changes on named queries.

Important functions in an instance of SolrSearchService:
* _.createQuery(Core)_ - Create a default query object.
* _.getQuery(Name)_ - Get the query object.
* _.getQueryFromHash(Hash, CoreUrl)_ - Parse the URL hash and return a query object.
* _.setQuery(Name, Query)_ - Set the query by name.
* _.updateQuery(QueryName)_ - Update the named query.


# Overview of Controllers

The application includes a number of controllers, some of which may not be actively used on an html page.  By default, most controllers are stored in the directory ``app/js/solr-ajax/controllers``.

* DateFacetController.js - Date facet controller filters a query by year range, displays controls to set the start/end dates.
* DateFacetHistogramController.js - Date facet histogram controller filters a query by year range, displays controls to set the start/end dates, displays a histogram control to both view and filter date by year range.
* DateRangeFacetController.js - Date facet controller filters a query by various date ranges.
* DocumentSearchResultsController.js - Presents search results for a named query.
* FacetSelectionController.js - Facet field query controller. Fetches a list of facet values from the search index for the specified field. When a facet value is selected by the user, a facet constraint is added to the target query, If facets are mutually exclusive, the 'hidden' variable is set to true to prevent the user from selecting more values. When the facet constraint is removed 'hidden' is set back to false.
* FacetClearSelectionController.js - Facet field clear selection controller.  Clears selected facets from query.
* FieldChosenFacetController.js - Chosen Field Facet Controller. It renders a Chosen.js dropdown / selection box as needed. 
* FieldCheckboxFacetController.js - Field checkbox facet controller. Creates controls for checkboxes to be used as part of a facet query. Currently handles Gender facets "M" and "F"
* FieldAlphaFilterFacetController.js - Alpha Field Facet Filter controller. It renders an A-Z filter which is then tied to the * search query.
* SearchBoxController.js - Provides auto-complete and extended search support aids.
* SearchHistoryController.js - Search history controller. Lists the last N user search queries. Takes the form of a queue.


# Overview of Directives

The application includes a number of directives, some of which may not be actively used on an html page.  By default, most directives are stored in the directory ``app/js/solr-ajax/directives``.

autocomplete.js - Adds to the directives for searchbox, searchhints, and searchbutton to autocomplete search values based on a selected hint suggestion.

# Other important files
"js/solr-ajax/app/document.js" - Define application routes.  Set _appleseedsSearchSolrProxy_ to be the Solr proxy URL.


# How to make a new Controller and add it to the app

To create a new Controller, create a new Angular.js file.  By default, most controllers are stored in the directory ``app/js/solr-ajax/controllers``.
Use these controllers as examples on how to create your own controllers.  Note that controllers are created differently than directives, which can be found in ``/app/js/solr-ajax/directives`` 

Once created, you may add your controller to the bottom of the appropriate html page,
    eg.  ``<script type="text/javascript" src="js/solr-ajax/controllers/MyFacetController.js"></script>``


# How to configure the app to point to a different collection

To configure the app to point to a different Solr collection, open the file \app\js\solr-ajax\app\document.js.

Then change the value of ``$rootScope.appleseedsSearchSolrProxy`` to be the url of the Solr server with the collection, 
    eg. "https://sample.com/solr/staging_post/select?"

If you are using search.php, or ``$rootScope.appleseedsSearchSolrProxy`` is already pointing to search.php, open the file \app\solr\search.php.

The Solr collection will automatically point to the ``$staging_url`` and ``$staging_collection`` defined at the start of the file if the host server is one of the values in ``$staging_triggers``.
Otherwise, the Solr collection will use ``$prod_url`` and ``$prod_coll``, both defined at the start of the file.

If you want to manually override this behavior, change the value of ``$url = str_replace("{selected_coll}", $selected_coll, $selected_url)``, 
    eg. ``$url = str_replace("{selected_coll}", "staging_post", $selected_url)``