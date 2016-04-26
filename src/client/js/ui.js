'use strict';

var $ = require('jquery');

var UI = {};

/**
 * Navbar
 */
function Navbar(options) {
    this.options = options;

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
};

UI.Navbar = Navbar;


/**
 * Login
 */
function Login(options) {
    this.options = options;

    // login container element
    this.$el = $(options.el);

    this.$backDrop = $('#login-backdrop');

    this.bindDOMEvents();
}

Login.prototype = {
    bindDOMEvents: function() {
        this.$el.on('click', '#login-guest', this.loginHandler.bind(this));
        this.$el.on('keypress', '#login-nickname', this.loginHandler.bind(this));
    },

    loginHandler: function(event) {
        if(event.type === 'keypress' && event.which !== 13) {
            return;
        }

        if (typeof this.options.onLogin === 'function') {
            this.options.onLogin.call(this);
        }
    },

    open: function() {
        this.$el.removeClass('hidden');
        this.$backDrop.removeClass('hidden');
    },

    close: function() {
        this.$el.addClass('hidden');
        this.$backDrop.addClass('hidden');
    }
};

UI.Login = Login;

module.exports = UI;
