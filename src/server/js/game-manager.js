var _ = require('underscore');
var config = require('config');
var UpdateManager = require('./update-manager');

var instance;
var ASPECT_RATIO = 4 / 3;
var SPAWN_BORDER = 100;
var PICKUP_SECTIONS = 10;
var PICKUP_ENABLE_INTERVAL = 5000;
var MAX_ENABLED_PICKUPS = 50;

var HealthPickup = { 
    type: 'health', 
    x: 0, 
    y: 0 
};

var AmmoPickup = { 
    type: 'ammo', 
    x: 0, 
    y: 0 
};

var pickTypes = [HealthPickup, AmmoPickup];

function GameManager() {
    this.io = null;
    this.width = config.get('game.width');
    this.height = this.width / ASPECT_RATIO;
    
    this.pickupsById = {};
    this.pickups = [];
    this.enabledPickups = [];
    this.disabledPickups = [];
    this.nextPickupEnableTime = 0;

    this.createPickups();
    UpdateManager.getInstance().subscribe(this.update.bind(this));
}

GameManager.prototype.setIO = function(io) {
    this.io = io;
};

GameManager.prototype.setup = function(socket) {
    socket.emit('game.setup', {
        width: this.width,
        height: this.height
    });
};

GameManager.prototype.getRandomWorldPosition = function() {
    var x = Math.max(_.random(0, this.width), SPAWN_BORDER);
    var y = Math.max(_.random(0, this.height), SPAWN_BORDER);

    return { 
        x: x, 
        y: y 
    };
};

GameManager.prototype.createPickups = function() {
    var sectionWidth = this.width / PICKUP_SECTIONS;
    var sectionHeight = this.height / PICKUP_SECTIONS;
    var pickup;
    var x = 0;
    var y = 0;

    for (var row = 0; row < PICKUP_SECTIONS; row++) {
        for (var col = 0; col < PICKUP_SECTIONS; col++) {
            x = Math.floor(sectionWidth * col + sectionWidth / 2);
            y = Math.floor(sectionHeight * row + sectionHeight / 2);

            pickup = this.createRandomPickup();
            pickup.id = x + '' + y;
            pickup.x = x + _.random(-sectionWidth / 3, sectionWidth / 3);
            pickup.y = y + _.random(-sectionHeight / 3, sectionHeight / 3);;
            this.pickups.push(pickup);
            this.pickupsById[pickup.id] = pickup;

            if (!pickup.isEnabled) {
                this.disabledPickups.push(pickup);
            } else {
                this.enabledPickups.push(pickup);
            }
        }
    }
};

GameManager.prototype.createRandomPickup = function() {
    var rndIndex = _.random(0, pickTypes.length - 1);
    var pickup = _.clone(pickTypes[rndIndex]);

    pickup.isEnabled = _.random(0, 5) === 5;

    return pickup;
};

GameManager.prototype.enableRandomPickup = function() {
    var rndIndex = _.random(0, this.disabledPickups.length - 1);
    var pickup = this.disabledPickups[rndIndex];

    pickup.isEnabled = true;

    this.disabledPickups.splice(rndIndex, 1);
    this.enabledPickups.push(pickup);

    this.io.emit('game.pickup.enable', pickup);

    return pickup;
};

GameManager.prototype.disablePickup = function(id) {
    var pickup = this.pickupsById[id];
    var index = _.indexOf(this.enabledPickups, pickup);

    pickup.isEnabled = false;

    if (index > -1) {
        this.enabledPickups.splice(index, 1);
    }

    this.disabledPickups.push(pickup);

    this.io.emit('game.pickup.disable', pickup);

    return pickup;
};

GameManager.prototype.getPickups = function() {
    return this.enabledPickups;
};

GameManager.prototype.update = function() {
    var now = new Date();
    var pickup;

    if (now > this.nextPickupEnableTime) {
        if (this.enabledPickups.length < MAX_ENABLED_PICKUPS) {
            this.enableRandomPickup();
        }

        this.nextPickupEnableTime += now + PICKUP_ENABLE_INTERVAL;
    }
};

module.exports.getInstance = function() {
    if (!instance) {
        instance = new GameManager();
    }

    return instance;
};
