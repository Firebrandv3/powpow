'use strict';

// later this entity should derive from an item entity
// and offer a base for other weapons
function Weapon(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'weapon', 0);

    this.projectileManager = new ProjectileManager(game, this.width * 2);
}

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.shoot = function(angle) {
    this.projectileManager.fire(this.world, angle);
};

// Projectile Group
function ProjectileManager(game, weaponWidth, weaponHeight) {
    Phaser.Group.call(this, game, game.world, 'projectileManager', false, true, Phaser.Physics.ARCADE);

    this.weaponWidth = weaponWidth;

    this.nextFire = 0;

    this.bulletSpeed = 1000;

    this.fireRate = 100;

    // 64 bullets
    for (var i = 0; i < 64; i++) {
        this.add(new Projectile(game), true);
    }
};

ProjectileManager.prototype = Object.create(Phaser.Group.prototype);
ProjectileManager.prototype.constructor = ProjectileManager;

ProjectileManager.prototype.fire = function (source, angle) {
    var x, y;

    if (this.game.time.time < this.nextFire) return;

    x = source.x + this.weaponWidth * Math.cos(angle);
    y = source.y + this.weaponWidth * Math.sin(angle);

    this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;
};

// Projectile Entity
function Projectile(game) {
    Phaser.Sprite.call(this, game, 0, 0, 'projectile');

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;
};

Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.fire = function(x, y, angle, speed, gx, gy) {
    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.moveToPointer(this, speed);
    this.body.allowGravity = false;

    this.rotation = angle;
};

Projectile.prototype.update = function() {
    if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }

};

module.exports = Weapon;
