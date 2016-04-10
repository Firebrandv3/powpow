var path = require('path');
var express = require('express');
var config = require('config');
var app = express();

// set the root path to our client folder and start the http server
app.use(express.static(path.join(__dirname, config.get('http.rootPath'))));
app.listen(config.get('http.port'));
