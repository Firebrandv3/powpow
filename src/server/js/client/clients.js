/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

var _ = require('underscore');
var Client = require('./client');

function Clients() {
    this.clients = [];

    this.clientsById = {};
}

Clients.prototype.get = function(id) {
    return this.clientsById[id] || null;
};

Clients.prototype.size = function() {
    return this.clients.length;
};

Clients.prototype.add = function(client) {
    this.clientsById[client.id] = client;
    this.clients.push(client);
};

Clients.prototype.remove = function(client) {
    var index = _.indexOf(this.clients, client);
    this.clients.splice(index, 1);
    delete this.clientsById[client.id];
};

Clients.prototype.without = function(client) {
    var clients = new Clients();
    clients.clients = _.without(this.clients, client);
    
    return clients;
};

Clients.prototype.getBest = function(n) {
    var clients = new Clients();
    var sorted = _.sortBy(this.clients, function(client) {
        // sort in descending order
        return client.killedCount * -1; 
    });

    clients.clients = _.first(sorted, n);

    return clients;
};

Clients.prototype.toJSON = function() {
    var clients = [];

    _.each(this.clients, function(client) {
        clients.push(client.toJSON());
    });

    return clients;
};

module.exports = Clients;
