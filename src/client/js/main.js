'use strict';

window.App = window.App || {
    User: {},

    UI: {},

    Game: {},

    socket: null
};

var UI = require('./ui');
App.Game.Initializer = require('./initializer');

window.addEventListener('load', function() {
    App.UI.Navbar = new UI.Navbar({
        container: '#navbar-container',
        navbar: '#navbar',
        trigger: '#navbar-trigger'
    });
});
