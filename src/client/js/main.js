'use strict';

var Initializer = require('./initializer');
var UI = require('./ui');

window.addEventListener('load', function() {
    new Initializer({
        el: 'game-container'
    });

    new UI.Navbar({
        container: '#navbar-container',
        navbar: '#navbar',
        trigger: '#navbar-trigger'
    });
});
