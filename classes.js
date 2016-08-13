//======================================================================================================================
//  Our core Bullet class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Spell classes

var Bullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

    if (this.tracking)
    {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0)
    {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }

};

//======================================================================================================================
//  Our core Spell class
//  child class of Bullet class
var Spell = [];

Spell.FireBall = function (game) {

    Phaser.Group.call(this, game, game.world, 'FireBall', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 300;
    this.fireRate = 5000; // 5 sec

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'i_fireball'), true);
    }

    return this;

};

Spell.FireBall.prototype = Object.create(Phaser.Group.prototype);
Spell.FireBall.prototype.constructor = Spell.FireBall;

Spell.FireBall.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16*Math.cos(source.rotation);
    var y = source.y + 16*Math.sin(source.rotation);

    this.getFirstExists(false).fire(x, y, source.angle, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//======================================================================================================================
//  Our core Wizard class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Spell classes
Wizard = function (game, x, y) {

    // creation of the sprite:
    Phaser.Sprite.call(this, game, x, y, 'sorcier');
    //Phaser.Group.call(this, game, game.world, 'sorcier', false, true, Phaser.Physics.ARCADE);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.setTo(0, 0);

    this.anchor.setTo(0.5, 0.5);
    game.add.existing(this);

    this.friction = 1;
    this.speed = 100;

};

Wizard.prototype = Object.create(Phaser.Sprite.prototype);
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function() {

    //================ Update movement ================
    // If the wizard is in close enough (2px) from the clicked point => velocity = 0
    if (Math.abs(this.position.x - clickedPoint.x) <= 7 && Math.abs(this.position.y - clickedPoint.y) <= 7) {
        this.body.velocity.setTo(0, 0);
    }
    else { // else we set up the velocity
        this.body.velocity.setTo(this.friction * this.speed * Math.cos(this.rotation), this.friction * this.speed * Math.sin(this.rotation));
    }

    //================ Update rotation ================
    // we compute the desiredAngle towards the clicked point (in radians)
    angleDesired = Math.atan2(clickedPoint.y - this.y, clickedPoint.x - this.x);

    // we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
    var error = angleDesired - this.rotation;

    // If the error is small enough, we set the angular velocity to zero
    if (Math.abs(error) <= 0.001) {
        this.body.angularVelocity = 0;
    }
    else {
        error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
        this.body.angularVelocity = K * error; // we multiply the error by a gain K in order to converge faster
    }
};

Wizard.prototype.castSpell = function(name) {
    if(name == "fireball")
        Spell[0].fire(this);
};

Wizard.prototype.isOnLava = function() {
    line = Math.floor(this.x / TILE_WIDTH);
    column = Math.floor(this.y / TILE_HEIGHT);

    var indexInMapArray = column*25 + line;
    if (map_array[indexInMapArray] == LAVA)
        return true;
    return false
};
