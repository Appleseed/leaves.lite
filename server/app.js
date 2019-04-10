'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config');

// Setup server
var app = express();
var http = require('http');

app.use(express.static('dist'))

// Express configuration
require('./config/express')(app);
// Route configutation
require('./routes')(app);

// Start server
http.createServer(app).listen(config.port, function() {
    console.log('Appleseed Leaves server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;