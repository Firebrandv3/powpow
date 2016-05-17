var config = require('config');
var orm = require('sequelize-connect');

var host = config.get('db.host');
var dataBase = config.get('db.database');
var user = config.get('db.user');
var password = config.get('db.password');

orm.discover = [__dirname + '/models'];
orm.connect(dataBase, user, password, {
    host: host,
    dialect: 'postgres'
});
