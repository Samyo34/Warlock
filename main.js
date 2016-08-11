
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

var circle;
var GlobalPosi;
var clickedPoint;
var veloX;
var veloY;
var speed;

var targetAngle = 0;
var tempLogoAngle;
var gap = 0;


function preload() {
    GlobalPosi = new Phaser.Point(game.world.centerX,game.world.centerY);
    veloX = 0;
    veloY = 0;
    speed = 2;

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

    game.stage.backgroundColor = '#787878';

    //  The 'mario' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('map');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('terrain_atlas', 'tiles');

    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('MyMap');


    circle = game.add.sprite(GlobalPosi.x, GlobalPosi.y, 'sorcier');
    clickedPoint = new Phaser.Point(circle.x, circle.y);
    game.physics.enable(circle, Phaser.Physics.ARCADE);
    // We set the pivot of the circle in the center of the sprite
    circle.pivot.x = circle.width * .35;
    circle.pivot.y = circle.height * .5;


    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

}


function update() {
    if (game.input.mousePointer.isDown) {
        clickedPoint = new Phaser.Point(game.input.x,game.input.y);
     //   console.log(angle + ',' + deltaRotation);
        veloX = (clickedPoint.x - circle.position.x) / circle.position.distance((clickedPoint));
        veloY = (clickedPoint.y - circle.position.y) / circle.position.distance((clickedPoint));
      //  circle.rotation = game.physics.arcade.moveToPointer(circle,100,Phaser.Input.activePointer,0);
//        circle.body.velocity.x = circle.body.velocity.x + circle.body.velocity.x * 2;
//        circle.body.velocity.y = circle.body.velocity.y + circle.body.velocity.y * 2;
    }
    if ((Math.abs(circle.position.distance(clickedPoint)) <= 7 ))
    {
        veloX =0;
        veloY= 0;
    }
    updateRotation();
    UpdateMovement();
}

function render() {
    //game.debug.geom(point, '#cfffff')
    game.debug.spriteInfo(circle,32,32);
}

function UpdateMovement(){
    circle.position.x = circle.position.x + veloX * speed;
    circle.position.y = circle.position.y + veloY * speed;

}

function updateRotation()
{
    targetAngle = (180 / Math.PI) * game.math.angleBetween(
            circle.x, circle.y,
            clickedPoint.x, clickedPoint.y) + 180;

    tempLogoAngle = circle.angle + 180;
    gap = (targetAngle - tempLogoAngle);

    if(gap > 1)
        circle.angle += 0.0015*gap*gap;
    else if (gap < -1)
        circle.angle -= 0.0015*gap*gap;
}




