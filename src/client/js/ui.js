/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var $ = require('jquery');
var _ = require('underscore');

var UI = {};

function isTouchDevice() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

/**
 * Navbar
 */
function Navbar(options) {
    this.options = options;

    this.$container = $(options.container);

    this.$navbar = $(options.navbar);

    this.$trigger = $(options.trigger);

    this.bindDOMEvents();

    if (isTouchDevice()) {
        this.hide();
    }
}

Navbar.prototype = {
    bindDOMEvents: function() {
        this.$trigger.on('click', this.toggle.bind(this));
    },

    toggle: function() {
        this.$container.toggleClass('is-visible');
    },

    add: function() {
        this.$container.addClass('is-visible');
    },

    hide: function() {
        this.$container.removeClass('is-visible');
    }
};

UI.Navbar = Navbar;


/**
 * Login
 */
function Login(options) {
    this.options = $.extend({
        type: 'init',
        predefinedNick: null
    }, options);

    // login container element
    this.$el = $(options.el);

    this.$backDrop = $('#login-backdrop');

    this.bindDOMEvents();
}

Login.prototype = {
    bindDOMEvents: function() {
        this.$el.on('click', '#login-guest', this.onPlayHandler.bind(this));
        this.$el.on('keypress', '#login-nickname', this.onPlayHandler.bind(this));
    },

    onPlayHandler: function(event) {
        if(event.type === 'keypress' && event.which !== 13) {
            return;
        }

        if (typeof this.options.onPlay === 'function') {
            this.options.onPlay.call(this, {
                nick: this.$el.find('#login-nickname').val()
            });
        }
    },

    open: function(options) {
        $.extend(this.options, options);
        this.prepareByType();
        this.$el.find('#login-guest').val(this.options.predefinedNick);
        this.$el.removeClass('hidden');
        this.$backDrop.removeClass('hidden');
    },

    close: function() {
        this.$el.addClass('hidden');
        this.$backDrop.addClass('hidden');
    },

    prepareByType: function() {
        if (this.options.type === 'reenter') {
            this.$backDrop.addClass('is-transparent');
            this.$el.find('.type-reenter').show();
            this.$el.find('.type-init').show();
        }
    }
};

UI.Login = Login;

function StatsScreen(options) {
    this.options = options;

    this.$el = $(options.el);

    this.$list = this.$el.find('#stats-list');

    this.isVisible = false;

    this.isDisabled = true;

    this.TAB_KEY = 9;

    this.tpl = '<li>' +
                    '<span class="stats-screen-nick"><%= nick || \'Anon\' %></span>' +
                    '<span class="stats-screen-score"><%= killedCount %></span>' +
                '</li>';
}

StatsScreen.prototype = {
    update: function(clients) {
        if (this.isVisible) {
            this.renderList(clients);
        }
    },

    renderList: function(clients) {
        var html = '';

        _.each(clients, function(client) {
            client.nick = _.unescape(client.nick);
            html += _.template(this.tpl)(client);
        }.bind(this));

        this.$list.html(html);
    },

    show: function() {
        this.isVisible = true;
        this.$el.show();
    },

    hide: function() {
        this.isVisible = false;
        this.$el.hide();
    },

    disable: function() {
        this.isDisabled = true;
        this.hide();
    },

    enable: function() {
        this.isDisabled = false;
    }
};

UI.StatsScreen = StatsScreen;

function Game(options) {
    this.options = options;

    this.$el = $(options.el);

    this.$onHit = $(options.onHitEl);

    this.isDisabled = true;

    this.health = this.options.maxHealth;

    this.ammo = this.options.maxAmmo;

    this.$healthContainer = this.$el.find(this.options.healthContainer);

    this.$ammoContainer = this.$el.find(this.options.ammoContainer);

    this.$healthIcons = this.createInventoryList(this.$healthContainer, this.options.maxHealth);

    this.$ammoIcons = this.createInventoryList(this.$ammoContainer, this.options.maxAmmo);
}

Game.prototype = {
    createInventoryList: function($container, max) {
        while (max--) {
            $container.append('<li class="is-active"></li>');
        }

        return $container.find('li');
    },

    increaseHealth: function() {
        if (this.increase(this.$healthIcons, this.health, this.options.maxHealth)) {
            this.health++;
            return true;
        }
        return false;
    },

    decreaseHealth: function() {
        if (this.decrease(this.$healthIcons, this.health, this.options.maxHealth)) {
            this.health--;
            return true;
        }
        return false;
    },

    increaseAmmo: function() {
        if (this.increase(this.$ammoIcons, this.ammo, this.options.maxAmmo)) {
            this.ammo++;
            return true;
        }
        return false;
    },

    decreaseAmmo: function() {
        if (this.decrease(this.$ammoIcons, this.ammo, this.options.maxAmmo)) {
            this.ammo--;
            return true;
        }
        return false;
    },

    increase: function($icons, current, max) {
        if (current >= max) return false;
        
        if (current !== void 0) {
            $icons.eq(current).addClass('is-active');
        } else {
            // add to all (reset)
            $icons.addClass('is-active');
        }

        return true;
    },

    decrease: function($icons, current, max) {
        if (current <= 0) return false;

        if (current !== void 0) {
            current--;
            $icons.eq(current).removeClass('is-active');
        } else {
            // add to all (reset)
            $icons.removeClass('is-active');
        }

        return true;
    },

    playHitEffect: function() {
        this.$onHit.addClass('is-visible');

        setTimeout(function() {
            this.$onHit.removeClass('is-visible');
        }.bind(this), 50);
    },

    reset: function() {
        this.health = this.options.maxHealth;
        this.ammo = this.options.maxAmmo;
        this.increase(this.$healthIcons);
        this.increase(this.$ammoIcons);
    },

    show: function() {
        this.$el.show();
    },

    hide: function() {
        this.$el.hide();
    },

    enable: function() {
        this.isDisabled = false;
        this.show();
    },

    disable: function() {
        this.isDisabled = true;
        this.hide();
    }
};

UI.Game = Game;

module.exports = UI;
