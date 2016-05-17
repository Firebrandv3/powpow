/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var _ = require('underscore');
var Enemy = require('./enemy');

function Enemies(game, data) {
    this.game = game;

    this.enemiesById = {};

    this.enemies = [];

    this.enemyGrp = this.game.add.group();

    this.parse(data);

    this.bindSocketEvents();
}

Enemies.prototype.parse = function(enemiesData) {
    return _.each(enemiesData, function(enemyData) {
        if (enemyData.isAlive) {
            this.add(enemyData);
        }
    }.bind(this));
};

Enemies.prototype.get = function(id) {
    return this.enemiesById[id] || null;
};

Enemies.prototype.size = function() {
    return this.enemies.length;
};

Enemies.prototype.add = function(enemyData) {
    var enemy = new Enemy(this.game, enemyData);
    this.enemiesById[enemy.id] = enemy;
    this.enemies.push(enemy);
    this.enemyGrp.add(enemy.createCharacter());
};

Enemies.prototype.removeById = function(id) {
    var enemy = this.get(id);

    if (enemy) {
        this.remove(enemy);
    }
};

Enemies.prototype.remove = function(enemy) {
    var index = _.indexOf(this.enemies, enemy);
    this.enemyGrp.remove(enemy.character);
    this.enemies.splice(index, 1);
    delete this.enemiesById[enemy.id];
};

Enemies.prototype.without = function(enemy) {
    var enemies = new Enemies();
    enemies.enemies = _.without(this.enemies, enemy);
    
    return enemies;
};

Enemies.prototype.update = function() {
    for (var i = this.enemies.length - 1; i >= 0; i--) {
        this.enemies[i].update();
    }
};

Enemies.prototype.bindSocketEvents = function() {
    App.socket.on('clients.updated.data', function(data) {
        var enemy = this.get(data.id);

        if (enemy) {
            enemy.updateData(data);
        }
    }.bind(this));

    App.socket.on('client.action.died', function(data) {
        var enemy = this.get(data.id);

        if (enemy) {
            enemy.updateData(data);
            enemy.die();
            this.remove(enemy);
        }
    }.bind(this));

    App.socket.on('client.action.shooted', function(data) {
        var enemy = this.get(data.id);

        if (enemy) {
            enemy.updateData(data);
            enemy.shootHandler();
        }
    }.bind(this));
}

module.exports = Enemies;

