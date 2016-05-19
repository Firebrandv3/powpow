/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var _ = require('underscore');
var HealthPickup = require('./health-pickup');
var AmmoPickup = require('./ammo-pickup');

var pickupByType = {
    'health': HealthPickup,
    'ammo': AmmoPickup
};

function Pickups(game, data) {
    this.game = game;

    this.pickupsById = {};

    this.pickups = [];

    this.pickupGrp = this.game.add.physicsGroup();

    this.parse(data);

    this.bindSocketEvents();
}

Pickups.prototype.parse = function(pickupsData) {
    return _.each(pickupsData, this.add.bind(this));
};

Pickups.prototype.get = function(id) {
    return this.pickupsById[id] || null;
};

Pickups.prototype.size = function() {
    return this.pickups.length;
};

Pickups.prototype.createPickup = function(pickupData) {
    var Pickup = pickupByType[pickupData.type];
    var pickup = new Pickup(this.game, pickupData.x, pickupData.y, pickupData.id);

    pickup.anchor.set(0.5);
    this.game.physics.enable(pickup);
    pickup.body.allowGravity = false;

    return pickup;
};

Pickups.prototype.add = function(pickupData) {
    var pickup = this.createPickup(pickupData);
    this.pickupsById[pickup.id] = pickup;
    this.pickups.push(pickup);
    this.pickupGrp.add(pickup);
};

Pickups.prototype.removeById = function(id) {
    var pickup = this.get(id);

    if (pickup) {
        this.remove(pickup);
    }
};

Pickups.prototype.remove = function(pickup) {
    var index = _.indexOf(this.pickups, pickup);
    this.pickupGrp.remove(pickup);
    this.pickups.splice(index, 1);
    delete this.pickupsById[pickup.id];
};

Pickups.prototype.onPick = function(character, pickup) {
    var tween;

    if (!character.onPickup(pickup)) return false;

    pickup.body.enable = false;

    if (character.isPlayer) {
        this.game.sound.play('pickup');
    }

    tween = this.game.add.tween(pickup).to({ 
        x: character.x, 
        y: character.y 
    }, 100);

    tween.onComplete.add(function() {
        this.remove(pickup);
    }.bind(this));

    tween.start();
};

Pickups.prototype.bindSocketEvents = function() {
    
}

module.exports = Pickups;

