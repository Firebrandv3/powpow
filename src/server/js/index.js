var path = require('path');
var express = require('express');
var config = require('config');
var app = express();
var rootPath = path.join(__dirname, config.get('http.rootPath'));

// set the root path to our client folder and start the http server
app.use(express.static(rootPath));

// 404 handler
app.use(function(req, res, next) {
    res.status(404).sendFile(path.join(rootPath, '404.html'));
});

app.listen(config.get('http.port'));
