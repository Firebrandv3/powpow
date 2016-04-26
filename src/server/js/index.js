var path = require('path');
var express = require('express');
var config = require('config');
var app = express();
var exphbs = require('express-handlebars');
var rootPath = path.join(__dirname, config.get('http.rootPath'));

function getPath(subPath) {
    return path.join(rootPath, subPath);
}

// set the root path to our client folder and start the http server
app.use(express.static(rootPath));

app.engine('.hbs', exphbs({ 
    defaultLayout: getPath('master'), 
    partialsDir: getPath('views/partials'),
    extname: '.hbs' 
}));

app.set('view engine', '.hbs');
app.set('views', getPath('views'))

app.get('/', function(req, res) {
    res.render('index', { title: 'HTML5 Shooter' });
});

// 404 handler
app.use(function(req, res) {
    res.status(404).sendFile(getPath('404.html'));
});


app.listen(config.get('http.port'));
