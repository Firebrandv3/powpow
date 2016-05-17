/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var io = require('socket.io-client');
var Player = require('../entities/player');

function Boot() {}

Boot.prototype.create = function() {
    this.socket = null;

    this.player = null;

    //The maximum number of Pointers allowed to be active at any one time
    this.game.input.maxPointers = 1;

    // dont‘t pause game on focusout
    this.game.stage.disableVisibilityChange = true;

    // disable conext menu
    this.game.canvas.oncontextmenu = function (event) { event.preventDefault(); }

    this.createConnection();
    this.bindSocketEvents();
};

Boot.prototype.createConnection = function() {
    App.socket = io.connect();
};

Boot.prototype.bindSocketEvents = function() {
    App.socket.on('connected', function() {
        App.socket.emit('client.enter', { 
            nick: App.User.nick,
            userId: App.User.id
        });
    }.bind(this));

    App.socket.on('game.setup', function(data) {
        App.Game.WIDTH = data.width;
        App.Game.HEIGHT = data.height;
    });

    App.socket.on('client.me.entered', this.meEnteredHandler.bind(this));
    App.socket.on('client.me.dead', this.meDeadHandler.bind(this));
};

Boot.prototype.meEnteredHandler = function(data) {
    this.player = new Player(this.game, data.me);
    this.game.state.start('game', true, false, this.player, data.enemies, data.pickups);
    App.UI.StatsScreen.enable();
    App.UI.Game.enable();
};

Boot.prototype.meDeadHandler = function(data) {
    this.game.input.enabled = false;

    App.UI.StatsScreen.disable();
    App.UI.Game.disable();
    this.player.die();

    App.UI.Login.open({
        type: 'reenter',
        
        predefinedNick: this.player.nick,

        onPlay: function(loginData) {
            this.player.nick = App.User.nick = loginData.nick;

            App.socket.emit('client.me.reenter', { nick: this.player.nick });
            App.socket.once('client.me.reentered', function(playerData) {
                this.game.input.enabled = true;
                
                App.UI.StatsScreen.enable();
                App.UI.Game.reset();
                App.UI.Game.enable();
                this.player.revive(playerData);

                App.UI.Login.close();
                App.UI.Navbar.hide();
            }.bind(this));
        }.bind(this)
    });
};

module.exports = Boot;
