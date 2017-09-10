#Appleseed Leaves.Lite - 0.4 #
This is a light-weight link/bookmark viewer for the Appleseed Search Platform ( part of the [Appleseed Framework](http://www.appleseedapp.com) ).

## Changelog
* 0.1 - Kigg - ASP.net MVC 3 upgraded to 4 on IIS / SQL Server - Customized Theme. - 2011-2014
* 0.2 - Single Page App in AngularJS using pure .JSON files. - 2015-2017 
* 0.3 - AngularJS 1.5 w/ Components in TypeScript using pure .JSON files. - 2016-2017 
* 0.4 - CURRENT - AngularJS 1.x in JS using Wallabag API - 2017-

## Features
* AngularJS 1.5 w/ Components (AngularJS 2 Coming)
* Quickly share links / bookmarks (via Wallabag Plugin to Chrome / Wallabag App)

# Where it began: KIGG 
While at [Anant](http://www.anant.us), I was creating this to iterate on the original Kigg project which was written in ASP.net MVC 3.
Kigg was a great "Digg" clone but we never had the time to get it up to speed. In hindsight, doing it as a SPA (Single Page Application)
with different data providers (JSON, SolR, Elastic, Web.API) may be a good start.

## Purpose of leaves.lite

The purpose of this leaves.lite project is to display links and make it easy to filter/search. The main use case is that we share a bunch
of links at work. In essence, much of the knowledge we pass to each other is a series of links. A beginner may need to go through and read/ watch / try out examples.
An intermediate level person may just need to get the "gist" of it. Most of the time we say "oh you should google that and go to the one by so and so."

Yes, we could have used Pocket, yes we could have used Pinterest, etc.. etc.. We initially thought about using the gitbook or gatsby approach and just rendering using static JSON files. This gets unmanageable with the amount of links we were managing which is now around ~4k and I still have another 10 to import. 

We are currently using Wallabag API because Wallabag is open source and most of the components are dockerized. We are going to connect up our search-stack to this as a source and feedback in the search results from elasticsearch/solr as an option. 

## Quickstart :

Assuming you have node and npm installed, you can run the following commands to get started. I recommend using yarn if you have it.
It's much faster that npm.

- `Download & Install Node https://nodejs.org/en/download/`
- `git clone https://github.com/Appleseed/leaves.lite`
- `cd leaves.lite/leaves.app`
-  Edit `leaves.lite/leaves.app/client/controller.js` and add your URL and your API token. 
- `npm install` (or `yarn install`)
- `bower install` (to be deprecated to use webpack)
- `node server/app.js`   
- `Open http://localhost:9000 in a browser to view the site`

Follow the instructions to open it up on the browser. The file that feeds the links are in.

# TODOS 

There's a bunch of stuff left to do.

## Interface:

- TODO: add Component routing
- TODO: migrate ideas from leaves.lite 0.2 (anant.co) layout
- DONE: add bootstrap or other responsive layout management

## Software:
- TODO: implement universal rendering of result views/ individual  / search views
- TODO: implement different modes for leaf component (list, card, stack)
- TODO: abstract JSON / REST behind a serviceFactory
- TODO: think about using GRAPHQL as a standard and put Wallabag/Wordpress/Elastic, etc. behind it with apollo 

## Data / Database:
- TODO: iterate on Leaf object definition (single item)
- TODO: iterate on Leaves object definition (collection of items organized by tag)
- TODO: iterate on twigPanel / "twig" object definition (shareable curated collection of items in a tree w/ ordering)
- TODO: add examples to interact with elastic / solr / algolia type services
- TODO: add examples to interact with web.api

## Systems
- DONE: create dockerfile
- TODO: document how to run on azure
- TODO: document how to run on github pages


