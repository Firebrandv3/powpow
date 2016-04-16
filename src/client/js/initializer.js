'use strict';

var Boot = require('./states/boot');
var Preload = require('./states/preload');
var Game = require('./states/game');

function Initializer(config) {
    this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, config.el);

    // initialize states
    this.game.state.add('boot', Preload);
    this.game.state.add('preload', Preload);
    this.game.state.add('game', Game);

    this.game.state.start('boot');
}

module.exports = Initializer;
