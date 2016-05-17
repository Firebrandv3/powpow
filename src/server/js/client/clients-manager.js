/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

var Client = require('./client');
var Clients = require('./clients');
var UpdateManager = require('../update-manager');
var GameManager = require('../game-manager');

var instance;

/**
 * Singleton class
 */
function ClientsManager() {
    this.io = null;

    this.clients = new Clients();
    UpdateManager.getInstance().subscribe(this.update.bind(this));
}

ClientsManager.prototype.setIO = function(io) {
    this.io = io;
};

ClientsManager.prototype.addClient = function(clientData, socket) {  
    var client;
    clientData.id = socket.id;
    clientData.socket = socket;

    client = new Client(clientData);
    this.clients.add(client);

    socket.broadcast.emit('client.entered', client.toJSON());
    socket.emit('client.me.entered', {
        me: client.toJSON(),
        enemies: this.clients.without(client).toJSON(),
        pickups: GameManager.getInstance().getPickups()
    });
};

ClientsManager.prototype.removeClient = function(clientId) {
    var client = this.clients.get(clientId);

    if (client) {
        this.clients.remove(client);
        client.socket.broadcast.emit('client.disconnected', client.toJSON());
    }
};

ClientsManager.prototype.getBestClients = function() {
    return this.clients.getBest(10);
};

ClientsManager.prototype.update = function() {
    this.io.emit('clients.info.best', { clients: this.getBestClients().toJSON() });
};

module.exports.getInstance = function() {
    if (!instance) {
        instance = new ClientsManager();
    }

    return instance;
};
