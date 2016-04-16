'use strict';

var Character = require('../entities/character');

var WORLD_ASPECT_RATIO = 4 / 3;
var WORLD_WIDTH = 2500;
var WORLD_HEIGHT = WORLD_WIDTH / WORLD_ASPECT_RATIO;

var PHYSICS_GRAVITY = 200;

function Game() {}

Game.prototype.create = function(game) {
    // to enable fps calculation
    this.game.time.advancedTiming = true;

    this.gridTileSprite = null;

    this.initWorld();
    this.initPhysics();

    this.player = new Character(this.game);

    this.game.camera.follow(this.player.sprite);

    this.cursors = game.input.keyboard.createCursorKeys();

    this.bindDOMEvents();
};

Game.prototype.bindDOMEvents = function() {
    window.addEventListener('resize', this.resizeHandler.bind(this));
};

Game.prototype.resizeHandler = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.game.renderer.resize(width, height);
    this.game.camera.setSize(width, height);

    this.gridTileSprite.width = width;
    this.gridTileSprite.height = height;
};

Game.prototype.initWorld = function() {
    this.game.stage.backgroundColor = '#fff';
    this.gridTileSprite = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'grid');
    this.gridTileSprite.fixedToCamera = true;
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
};

Game.prototype.initPhysics = function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = PHYSICS_GRAVITY;
};

Game.prototype.update = function() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.text('fps: '+ this.game.time.fps || '--', 32, 140);

    this.gridTileSprite.tilePosition.set(-this.game.camera.x, -this.game.camera.y);

    // demo code
    if (this.cursors.left.isDown)
    {
        this.player.sprite.x += 8;
    }
    else if (this.cursors.right.isDown)
    {
        this.player.sprite.x -= 8;
    }

    if (this.cursors.up.isDown)
    {
        this.player.sprite.y += 8;
    }
    else if (this.cursors.down.isDown)
    {
        this.player.sprite.y -= 8;
    }
};

module.exports = Game;
