
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 800, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

var circle;
var GlobalPosi;
var clickedPoint;
var speed = 100;
var K = 1000;
var error = 0;

var playerOnLava = false;

var Spell = [];

var point = new Phaser.Point(0, 0) ;
var epsilon = 0.0001;
var angleDesired;

var map_array = [369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369];
var LAVA = 369;
var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

    function preload() {
    GlobalPosi = new Phaser.Point(game.world.centerX,game.world.centerY);

    //  Tilemaps are split into two parts: The actual map data (usually stored in a CSV or JSON file)
    //  and the tileset/s used to render the map.

    //  Here we'll load the tilemap data. The first parameter is a unique key for the map data.

    //  The second is a URL to the JSON file the map data is stored in. This is actually optional, you can pass the JSON object as the 3rd
    //  parameter if you already have it loaded (maybe via a 3rd party source or pre-generated). In which case pass 'null' as the URL and
    //  the JSON object as the 3rd parameter.

    //  The final one tells Phaser the foramt of the map data, in this case it's a JSON file exported from the Tiled map editor.
    //  This could be Phaser.Tilemap.CSV too.

    game.load.tilemap('map', 'map_lave_v1.json', null, Phaser.Tilemap.TILED_JSON);

    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:

    game.load.image('tiles', 'terrain_atlas.png');

    game.load.image('sorcier', 'sorcier.png');
    game.load.image('i_fireball', 'fireball.png');
}

var map;
var layer;

function create() {

    //  The 'map' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('map');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('terrain_atlas', 'tiles');

    //  Creates a layer from the MyMap layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('background');

    circle = game.add.sprite(GlobalPosi.x, GlobalPosi.y, 'sorcier');
    game.physics.enable(circle, Phaser.Physics.ARCADE);
    circle.body.velocity.setTo(0, 0);

    // We set the pivot of the circle in the center of the sprite
    circle.pivot.x = circle.width * .5;
    circle.pivot.y = circle.height * .5;

    // we set up the clicked point at the same position than the circle
    clickedPoint = new Phaser.Point(circle.x, circle.y);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

    // Try for collisions:
    //map.setCollision([368, 369, 370]);
    //circle.body.collideWorldBounds = true;

    //map.setCollision(369);

    //=========== SPELLS ======================
    // We add in the spell array the fireball
    Spell.push(new Spell.FireBall(this.game));

    for (var i = 1; i < Spell.length; i++)
    {
        Spell[i].visible = false;
    }

    //  This will set Tile ID 368 (the lava) to call the hitLava function when collided with
    //map.setTileIndexCallback(373, hitGround, this);
    //map.setTileIndexCallback(369, hitLava, this);
}

function hitLava() {
    playerOnLava = true;
}

var line;
var column;

function isPlayerOnLava() {
    line = Math.floor(circle.x / TILE_WIDTH);
    column = Math.floor(circle.y / TILE_HEIGHT);

    var indexInMapArray = column*25 + line;
    if (map_array[indexInMapArray] == LAVA)
        return true;
    return false
}

function update() {
    //game.physics.arcade.collide(circle, layer);

    if (isPlayerOnLava())
        console.log("PLAYER_ON_LAVA");
    else
        console.log("PLAYER_ON_GROUND");

    if (game.input.mousePointer.isDown) {
        clickedPoint = new Phaser.Point(game.input.x, game.input.y);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        Spell[0].fire(circle);
    }

    UpdateMovement();
    UpdateRotation();
}

function UpdateMovement(){

    // If circle is in close enough (2px) from the clicked point => velocity = 0
    if (Math.abs(circle.position.x - clickedPoint.x) <= 7 && Math.abs(circle.position.y - clickedPoint.y) <= 7) {
        circle.body.velocity.setTo(0, 0);
    }
    else { // else we set up the velocity
        circle.body.velocity.setTo(speed * Math.cos(circle.rotation), speed * Math.sin(circle.rotation));
    }
}

function UpdateRotation(){

    // we compute the desiredAngle towards the clicked point (in radians)
    angleDesired = Math.atan2(clickedPoint.y - circle.y, clickedPoint.x - circle.x);

    // we compute the gap in radians (circle.rotation is in radians and circle.angle in degrees)
    error = angleDesired - circle.rotation;

    // If the error is small enough, we set the angular velocity to zero
    if (Math.abs(error) <= 0.001) {
        circle.body.angularVelocity = 0;
    }
    else {
        error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
        circle.body.angularVelocity = K * error; // we multiply the error by a gain K in order to converge faster
    }
}

function floatEquality(a, b) {
    if(Math.abs(a - b) < epsilon)
        return true;
    return false
}

function render() {
    game.debug.spriteInfo(circle, 32, 32);
    //game.debug.text('angularVelocity: ' + circle.body.angularVelocity, 32, 200);
    //game.debug.text('angularAcceleration: ' + circle.body.angularAcceleration, 32, 232);
    //game.debug.text('angularDrag: ' + circle.body.angularDrag, 32, 264);
    //game.debug.text('rotation: ' + circle.rotation, 32, 296);
    //game.debug.text('velocity: ' + circle.body.velocity.x + " " + circle.body.velocity.y, 32, 328);
    game.debug.text('[' + line + "," + column + "]", 32, 328);
    game.debug.text('pointClicked: ' + clickedPoint, 32, 364);
    game.debug.text('circle.position: ' + circle.position, 32, 396);
    game.debug.text('onLava: ' + playerOnLava, 32, 430);
    //game.debug.geom(point, 'rgba(255,255,255,1)');
}


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
    var y = source.y + 16*Math.sin(source.rotation)

    this.getFirstExists(false).fire(x, y, source.angle, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};