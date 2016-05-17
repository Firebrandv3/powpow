/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('./socket').listen(http);
var config = require('config');
var exphbs = require('express-handlebars');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var dbSetup = require('./db-setup');
var hbsHelpers = require('./hbs-helpers');
var passportService = require('./passport-service')(passport);

var rootPath = path.join(__dirname, config.get('http.rootPath'));

// set the root path to our client folder and start the http server
app.use(express.static(rootPath));
app.use(cookieParser());
app.use(session({ secret: config.get('auth.session.secret') }));
app.use(passport.initialize());
app.use(passport.session());

function getPath(subPath) {
    return path.join(rootPath, subPath);
}

app.engine('.hbs', exphbs({ 
    defaultLayout: getPath('master'), 
    partialsDir: getPath('views/partials'),
    extname: '.hbs',
    helpers: hbsHelpers
}));

app.set('view engine', '.hbs');
app.set('views', getPath('views'));

require('./routes')(app, passport);

http.listen(process.env.PORT || config.get('http.port'));

console.log('Server listening on port: ', process.env.PORT || config.get('http.port'));
