var socketio = require('socket.io');
var GameManager = require('./game-manager').getInstance();
var UpdateManager = require('./update-manager').getInstance();
var ClientsManager = require('./client/clients-manager').getInstance();

function listen(http) {
    var io = socketio.listen(http);
    
    GameManager.setIO(io);
    ClientsManager.setIO(io);
    UpdateManager.start();

    io.on('connection', function(socket) {
        GameManager.setup(socket);

        socket.emit('connected', { id: socket.id });

        socket.on('client.enter', function(data) {
            ClientsManager.addClient(data, socket);
        });

        socket.on('disconnect', function() {
            ClientsManager.removeClient(socket.id);
        });
    });
}

module.exports.listen = listen;
