
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

var circle;
var GlobalPosi;
var clickedPoint;
var speed = 100;
var K = 1000;
var error = 0;

var point = new Phaser.Point(0, 0) ;
var epsilon = 0.0001;
var angleDesired;

var fireballs;

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

    game.load.tilemap('map', 'map_lave_v0.json', null, Phaser.Tilemap.TILED_JSON);

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
    layer = map.createLayer('MyMap');

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


    // ========================== Try fireball ========================== //
    // Create the group using the group factory
    fireballs = game.add.group();
    // To move the sprites later on, we have to enable the body
    fireballs.enableBody = true;
    // We're going to set the body type to the ARCADE physics, since we don't need any advanced physics
    fireballs.physicsBodyType = Phaser.Physics.ARCADE;
    /*

     This will create 20 sprites and add it to the stage. They're inactive and invisible, but they're there for later use.
     We only have 20 laser bullets available, and will 'clean' and reset they're off the screen.
     This way we save on precious resources by not constantly adding & removing new sprites to the stage

     */
    fireballs.createMultiple(20, 'i_fireball');

    /*

     Behind the scenes, this will call the following function on all lasers:
     - events.onOutOfBounds.add(resetLaser)
     Every sprite has an 'events' property, where you can add callbacks to specific events.
     Instead of looping over every sprite in the group manually, this function will do it for us.

     */
    fireballs.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetLaser);
    // Same as above, set the anchor of every sprite to 0.5, 0.5
    fireballs.callAll('anchor.setTo', 'anchor', 0.5, 0.5);

    // This will set 'checkWorldBounds' to true on all sprites in the group
    fireballs.setAll('checkWorldBounds', true);

    // ...

}

function resetLaser(laser) {
    // Destroy the laser
    laser.kill();
}



function update() {
    //game.physics.arcade.collide(circle, layer);

    if (game.input.mousePointer.isDown) {
        clickedPoint = new Phaser.Point(game.input.x, game.input.y);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        fireLaser();
    }

    UpdateMovement();
    UpdateRotation();

    //console.log(((180/Math.PI)*circle.body.rotation)%360);
    //console.log((Math.PI/180)*circle.angle);
    //point.x = circle.x + 16*Math.cos((Math.PI/180)*circle.angle);
    //point.y = circle.y + 16*Math.sin((Math.PI/180)*circle.angle);
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
    game.debug.text('angularVelocity: ' + circle.body.angularVelocity, 32, 200);
    game.debug.text('angularAcceleration: ' + circle.body.angularAcceleration, 32, 232);
    game.debug.text('angularDrag: ' + circle.body.angularDrag, 32, 264);
    game.debug.text('rotation: ' + circle.rotation, 32, 296);
    game.debug.text('velocity: ' + circle.body.velocity.x + " " + circle.body.velocity.y, 32, 328);
    game.debug.text('pointClicked: ' + clickedPoint, 32, 364);
    game.debug.text('circle.position: ' + circle.position, 32, 396);
    //game.debug.geom(point, 'rgba(255,255,255,1)');
}

function fireLaser() {
    // Get the first laser that's inactive, by passing 'false' as a parameter
    var fb = fireballs.getFirstExists(false);
    if (fb) {
        // If we have a laser, set it to the starting position
        fb.reset(circle.x + 16*Math.cos(circle.rotation),  circle.y + 16*Math.sin(circle.rotation));
        // Give it a velocity of -500 so it starts shooting
        fb.body.velocity.x = 500*Math.cos(circle.rotation);
        fb.body.velocity.y = 500*Math.sin(circle.rotation);
    }

}