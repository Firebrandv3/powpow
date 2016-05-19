/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var PROJECTILE_SPEED = 1400;
var PROJECTILE_LIFESPAN = 300;

var instance;

// Projectile Group
function ProjectilesManager() {
    this.projectilesGrp = null;
};

ProjectilesManager.prototype.createProjectiles = function(game) {
    this.game = game || this.game;
    this.projectilesGrp = this.game.add.physicsGroup();

    for (var i = 0; i < 100; i++) {
        this.projectilesGrp.add(new Projectile(this.game), true);
    }
};

ProjectilesManager.prototype.fire = function(source, angle, offsetOrigin, shooter) {
    var x, y;
    var projectile = this.projectilesGrp.getFirstExists(false);

    projectile.shooter = shooter;

    x = source.x + offsetOrigin * Math.cos(angle);
    y = source.y + offsetOrigin * Math.sin(angle);

    projectile.fire(x, y, angle);
};

ProjectilesManager.prototype.onHit = function(character, projectile) {
    character.onHit(projectile.shooter);

    projectile.explode();

    if (!projectile.alreadyDead) {
        this.game.sound.play('boom');
    }
};

// Projectile Entity
function Projectile(game) {
    Phaser.Sprite.call(this, game, 0, 0, 'projectile');

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.alreadyDead = false;

    this.explosionAnimation = null;

    this.addAnimations();
};

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.addAnimations = function() {
    this.animations.add('flying', [0, 1, 2], 15);
    this.explosionAnimation = this.animations.add('explosion', [0, 3, 4, 5], 10);
};

Projectile.prototype.fire = function(x, y, angle) {
    this.reset(x, y);
    this.scale.setTo(1);

    this.body.enable = true;
    this.body.allowGravity = false;
    this.rotation = angle;

    this.body.velocity.x = Math.cos(this.rotation) * PROJECTILE_SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * PROJECTILE_SPEED;

    this.animations.play('flying');
    this.startLifeSpan();
};

Projectile.prototype.startLifeSpan = function() {
    this.game.time.events.add(PROJECTILE_LIFESPAN, this.explode.bind(this));
};

Projectile.prototype.explode = function() {
    this.alreadyDead = true;
    this.body.enable = false;

    this.body.velocity.set(0);
    this.scale.setTo(2);

    this.animations.play('explosion');

    this.explosionAnimation.onComplete.add(function() {
        this.kill();
    }, this);
};

function getInstance() {
    if (!instance) {
        instance = new ProjectilesManager();
    }

    return instance;
}

module.exports = getInstance();
