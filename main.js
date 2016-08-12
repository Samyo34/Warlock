
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

    game.load.image('sorcier', 'sorcier2.png');
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
    circle.pivot.x = circle.width * .35;
    circle.pivot.y = circle.height * .5;

    // we set up the clicked point at the same position than the circle
    clickedPoint = new Phaser.Point(circle.x, circle.y);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();
}


function update() {

    point.x = circle.position.x;
    point.y = circle.position.y;

    if (game.input.mousePointer.isDown) {
        clickedPoint = new Phaser.Point(game.input.x, game.input.y);
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
    game.debug.text('angularVelocity: ' + circle.body.angularVelocity, 32, 200);
    game.debug.text('angularAcceleration: ' + circle.body.angularAcceleration, 32, 232);
    game.debug.text('angularDrag: ' + circle.body.angularDrag, 32, 264);
    game.debug.text('rotation: ' + circle.rotation, 32, 296);
    game.debug.text('velocity: ' + circle.body.velocity.x + " " + circle.body.velocity.y, 32, 328);
    game.debug.text('pointClicked: ' + clickedPoint, 32, 364);
    game.debug.text('circle.position: ' + circle.position, 32, 396);
    game.debug.geom(point, 'rgba(255,255,255,1)');
}