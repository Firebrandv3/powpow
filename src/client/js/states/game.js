'use strict';

var _ = require('underscore');
var Enemies = require('../entities/enemies');
var Pickups = require('../entities/pickups');
var ProjectilesManager = require('../entities/projectiles');

var PHYSICS_GRAVITY = 800;

function Game() {}

Game.prototype.init = function(player, enemiesData, pickupsData) {
    this.enemiesData = enemiesData;
    this.pickupsData = pickupsData;
    this.player = player;
};

Game.prototype.create = function() {
    // to enable fps calculation
    this.game.time.advancedTiming = true;

    this.gridTileSprite = null;

    this.initWorld();
    this.initPhysics();

    this.enemies = new Enemies(this.game, this.enemiesData);
    this.pickups = new Pickups(this.game, this.pickupsData);
    this.ProjectilesManager = ProjectilesManager;

    this.ProjectilesManager.createProjectiles(this.game);
    this.player.createCharacter();

    this.bindDOMEvents();
    this.bindSocketEvents();
};

Game.prototype.bindDOMEvents = function() {
    window.addEventListener('resize', this.resizeHandler.bind(this));
};

Game.prototype.bindSocketEvents = function() {
    App.socket.on('client.entered', function(data) {
        this.enemies.add(data);
    }.bind(this));

    App.socket.on('client.reentered', function(data) {
        this.enemies.add(data);
    }.bind(this));

    App.socket.on('client.disconnected', function(data) {
        this.enemies.removeById(data.id);
    }.bind(this));

    App.socket.on('clients.info.best', function(data) {
        App.UI.StatsScreen.update(data.clients);
    }.bind(this));

    App.socket.on('game.pickup.enable', function(pickupData) {
        this.pickups.add(pickupData);
    }.bind(this));

    App.socket.on('game.pickup.disable', function(pickupData) {
        this.pickups.removeById(pickupData.id);
    }.bind(this));
};

Game.prototype.resizeHandler = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.gridTileSprite.width = width;
    this.gridTileSprite.height = height;

    this.game.camera.setSize(width, height);
    this.game.renderer.resize(width, height);
};

Game.prototype.initWorld = function() {
    this.game.stage.backgroundColor = '#fff';
    this.gridTileSprite = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'grid');
    this.gridTileSprite.fixedToCamera = true;
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.world.setBounds(0, 0, App.Game.WIDTH, App.Game.HEIGHT);
};

Game.prototype.initPhysics = function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = PHYSICS_GRAVITY;
};

Game.prototype.update = function() {
    this.gridTileSprite.tilePosition.set(-this.game.camera.x, -this.game.camera.y);

    this.game.physics.arcade.overlap(this.enemies.enemyGrp, this.ProjectilesManager.projectilesGrp, this.ProjectilesManager.onHit);
    this.game.physics.arcade.overlap(this.player.character, this.ProjectilesManager.projectilesGrp, this.ProjectilesManager.onHit);
    this.game.physics.arcade.overlap(this.player.character, this.pickups.pickupGrp, this.pickups.onPick.bind(this.pickups));
    this.game.physics.arcade.overlap(this.enemies.enemyGrp, this.pickups.pickupGrp, this.pickups.onPick.bind(this.pickups));

    this.player.update();
    this.enemies.update();
};

Game.prototype.render = function() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.text('fps: '+ this.game.time.fps || '--', 32, 140);
};

module.exports = Game;
