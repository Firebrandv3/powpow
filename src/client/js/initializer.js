'use strict';

var Boot = require('./states/boot');
var Preload = require('./states/preload');
var Game = require('./states/game');
var UI = require('./ui');
var $ = require('jquery');

function Initializer(options) {
    var that = this;
    var login;

    this.options = options;

    login = new UI.Login({
        el: '#login',

        onLogin: function() {
            login.close();
            that.hideNavbar();
            that.game.state.start('boot');
        }
    });

    this.initGame();
}

Initializer.prototype.initGame = function() {
    this.game = new Phaser.Game(
        window.innerWidth, 
        window.innerHeight, 
        Phaser.AUTO, 
        this.options.el
    );

    // initialize states
    this.game.state.add('boot', Preload);
    this.game.state.add('preload', Preload);
    this.game.state.add('game', Game);
};

Initializer.prototype.hideNavbar = function() {
    setTimeout(function() {
        $('#navbar-container').removeClass('is-visible');
    }, 250);
};

module.exports = Initializer;
