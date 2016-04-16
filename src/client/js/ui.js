'use strict';

var $ = require('jquery');

var UI = {};

function Navbar(options) {
    this.$container = $(options.container);

    this.$navbar = $(options.navbar);

    this.$trigger = $(options.trigger);

    this.bindDOMEvents();
}

Navbar.prototype = {
    bindDOMEvents: function() {
        this.$trigger.on('click', this.toggle.bind(this));
    },

    toggle: function() {
        this.$container.toggleClass('is-visible');
    }
}

UI.Navbar = Navbar;

module.exports = UI;
