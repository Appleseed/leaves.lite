#Appleseed Leaves.Lite#
This is a light-weight link/bookmark viewer for the Appleseed Search Platform ( part of the [Appleseed Framework](http://www.appleseedapp.com) ).

##Features##
* No DB Required / Links in JSON
* AngularJS 1.5 w/ Components (AngularJS 2 Coming)
* Quickly share links / bookmarks
* TypeScript so code is better
* Webpack Module management for future modularization
* Karma Tests for good unit Tests

#Where it began: KIGG##
While at [Anant](http://www.anant.us), I was creating this to iterate on the original Kigg project which was written in ASP.net MVC 3.
Kigg was a great "Digg" clone but we never had the time to get it up to speed. In hindsight, doing it as a SPA (Single Page Application)
with different data providers (JSON, SolR, Elastic, Web.API) may be a good start.

##Purpose of leaves.lite##

The purpose of this leaves.lite project is to display links and make it easy to filter/search. The main use case is that we share a bunch
of links at work. In essence, much of the knowledge we pass to each other is a series of links. A beginner may need to go through and read/ watch / try out examples.
An intermediate level person may just need to get the "gist" of it. Most of the time we say "oh you should google that and go to the one by so and so."

<img src="https://www.dropbox.com/s/7ijmms4gixat7k7/Screenshot%202016-11-24%2014.08.28.png?dl=1">

Yes, we could have used Pocket, yes we could have used Pinterest, etc.. etc.. but this is very _ very _ very simple. If you want to stick with
just JSON, you can just do that. Because after a build, its all static, you can even host on github pages!

<img src="https://www.dropbox.com/s/x8z9kf0iybelkl7/Screenshot%202016-11-24%2014.09.40.png?dl=1">

##Quickstart :##

Assuming you have node and npm installed, you can run the following commands to get started. I recommend using yarn if you have it.
It's much faster that npm.

- `Download & Install Node https://nodejs.org/en/download/`
- `git clone https://github.com/Appleseed/leaves.lite`
- `cd leaves.lite`
- `npm install` (or `yarn install`)
- `npm run serve` (or `yarn run serve`) to check out the site.

Follow the instructions to open it up on the browser. The file that feeds the links are in.

- `leaves.lite/src/data`

#TODOS#

There's a bunch of stuff left to do.

##Interface:##

- TODO: add Component routing
- TODO: add bootstrap or other responsive layout management
- TODO: migrate ideas from anant.co layout

##Software:##
- TODO: bind main.html leaves instances from another JSON
- TODO: implement different modes for leaf component
- TODO: abstract JSON / REST behind a serviceFactory


##Data / Database:##
- TODO: iterate on Leaf object definition
- TODO: iterate on Leaves object definition
- TODO: iterate on twigPanel / "twig" object definition
- TODO: add examples to interact with elastic / solr / algolia type services
- TODO: add examples to interact with web.api

###Systems###
- TODO: create dockerfile
- TODO: document how to run on azure
- TODO: document how to run on github pages

This is built with the [FountainJS webapp](https://fountainjs.io) [yeoman generator](https://yeoman.io) and is configured to run on AngularJS 1, TypeScript, Gulp, Webpack, TSLint, etc..
