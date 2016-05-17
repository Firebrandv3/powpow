/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var config = require('config');

var Boot = require('./states/boot');
var Preload = require('./states/preload');
var Game = require('./states/game');

var UI = require('./ui');
var $ = require('jquery');

function Initializer(options) {
    var that = this;

    this.options = options;

    App.UI.Login = new UI.Login({
        el: '#login'
    });

    App.UI.Login.open({
        onPlay: function(data) {
            App.User.nick = data.nick;

            App.UI.Login.close();
            that.game.state.start('boot');
            App.UI.Navbar.hide();
        }
    });

    App.UI.StatsScreen = new UI.StatsScreen({
        el: '#stats-screen'
    });

    App.UI.Game = new UI.Game({
        el: '#game-ui',
        healthContainer: '#game-ui-health',
        ammoContainer: '#game-ui-ammo',
        onHitEl: '#game-ui-onhit-effect',
        maxHealth: config.get('Client.maxHealth'),
        maxAmmo: config.get('Client.maxAmmo')
    });

    this.initGame();
}

Initializer.prototype.initGame = function() {
    this.game = new Phaser.Game(
        window.innerWidth, 
        window.innerHeight, 
        Phaser.CANVAS, 
        this.options.el
    );

    // initialize states
    this.game.state.add('preload', Preload);
    this.game.state.add('boot', Boot);
    this.game.state.add('game', Game);

    this.game.state.start('preload');
};

module.exports = Initializer;
