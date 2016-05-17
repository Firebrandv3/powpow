var _ = require('underscore');
var config = require('config');
var GameManager = require('../game-manager').getInstance();
var ClientsManager = require('./clients-manager');
var orm = require('sequelize-connect');

const MAX_NAME_LENGTH = 15;
const MAX_HEALTH = config.get('Client.maxHealth');
const MAX_AMMO = config.get('Client.maxAmmo');

function Client(data) {
    this.socket = data.socket;
    
    this.id = data.id;

    this.userId = data.userId;

    this.user = null;
    
    this.nick = this.prepareNick(data.nick);

    this.isAimingLeft = data.isAimingLeft;

    this.reset();

    this.bindSocketEvents();

    if (this.userId !== void 0) {
        this.loadUserData();
    }
}

Client.prototype.toJSON = function() {
    return {
        id: this.id,
        nick: this.nick,
        x: this.x,
        y: this.y,
        aimDirection: this.aimDirection,
        isAimingLeft: this.isAimingLeft,
        isFlying: this.isFlying,
        isAlive: this.isAlive,
        health: this.health,
        ammo: this.ammo,
        killedCount: this.killedCount
    };
};

Client.prototype.loadUserData = function() {
    orm.models.User.findById(this.userId).then(function(user) {
        this.user = user;
    }.bind(this));
};

Client.prototype.bindSocketEvents = function() {
    this.socket.on('client.update.data', this.updateData.bind(this));

    this.socket.on('client.action.shoot', function(data) {
        this.ammo--;

        this.aimDirection = data.aimDirection;
        this.socket.broadcast.emit('client.action.shooted', this.toJSON());
    }.bind(this));

    this.socket.on('client.action.hit', function(data) {
        var shooter = ClientsManager.getInstance().clients.get(data.shooterId);

        this.health--;

        if (this.health <= 0) {
            this.isAlive = false;
            this.socket.emit('client.me.dead', this.toJSON());
            this.socket.broadcast.emit('client.action.died', this.toJSON());
            this.deathHandler();
            
            if (shooter) {
                shooter.increaseKilledCount();
            }
        }
    }.bind(this));

    this.socket.on('client.action.pickup', this.pickupHandler.bind(this));


    this.socket.on('client.me.reenter', this.reEnterHandler.bind(this));
};

Client.prototype.setPosition = function(point) {
    this.x = point.x;
    this.y = point.y;
};

Client.prototype.reEnterHandler = function(data) {
    this.reset();

    this.nick = this.prepareNick(data.nick);

    this.socket.emit('client.me.reentered', this.toJSON());
    this.socket.broadcast.emit('client.reentered', this.toJSON());
};

Client.prototype.pickupHandlerMapping = {
    'health': function() {
        if (this.health < MAX_HEALTH) {
            this.health++;
            return true;
        }
        return false;
    },

    'ammo': function() {
        if (this.ammo < MAX_AMMO) {
            this.ammo++;
            return true;
        }
        return false;
    }
};

Client.prototype.pickupHandler = function(pickupData) {
    var handler = this.pickupHandlerMapping[pickupData.type];
    
    if (!!handler && handler.call(this)) {
        GameManager.disablePickup(pickupData.id);
    }
};

Client.prototype.deathHandler = function() {
    var game;

    // not logged in
    if (!this.user) return;

    orm.models.Game.create({
        score: this.killedCount,
        nick: this.nick
    }).then(function(game) {
        this.user.addGame(game);
    }.bind(this));
};

Client.prototype.reset = function() {
    this.x = 0;

    this.y = 0;

    this.aimDirection = null;

    this.isFlying = false;

    this.killedCount = 0;

    this.health = MAX_HEALTH;

    this.ammo = MAX_AMMO;

    this.isAlive = true;

    this.setPosition(GameManager.getRandomWorldPosition());
};

Client.prototype.updateData = function(data) {
    this.isAimingLeft = data.isAimingLeft;

    this.aimDirection = data.aimDirection;

    this.isFlying = data.isFlying;

    this.setPosition({
        x: data.x,
        y: data.y
    });

    this.socket.broadcast.emit('clients.updated.data', this.toJSON());
};

Client.prototype.prepareNick = function(nick) {
    nick = _.escape(nick);
    nick = nick.substr(0, MAX_NAME_LENGTH - 1);
    return nick;
};

Client.prototype.increaseKilledCount = function() {
    this.killedCount++;
};

module.exports = Client; 
