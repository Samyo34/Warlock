//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 800, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

var GlobalPosi;
var clickedPoint;
var speed = 100;
var K = 1000;
var error = 0;

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
var wizard = [];

function create() {

    //  The 'map' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('map');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('terrain_atlas', 'tiles');

    //  Creates a layer from the MyMap layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('background');

    // we set up the clicked point at the same position than the circle
    clickedPoint = new Phaser.Point(GlobalPosi.x, GlobalPosi.y);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

    // Try for collisions:
    //map.setCollision([368, 369, 370]);
    //circle.body.collideWorldBounds = true;

    //map.setCollision(369);

    //=========== WIZARDS ======================
    // We add in the spell array the fireball
    //Wizard.push(new Wizard(game));
    //var lol = new Wizard(game);
    //game.add.existing(lol);
    wizard[0] = new Wizard(game, GlobalPosi.x, GlobalPosi.y);

    //=========== SPELLS ======================
    // We add in the spell array the fireball
    Spell.push(new Spell.FireBall(game));

    for (var i = 1; i < Spell.length; i++)
    {
        Spell[i].visible = false;
    }

    //  This will set Tile ID 368 (the lava) to call the hitLava function when collided with
    //map.setTileIndexCallback(373, hitGround, this);
    //map.setTileIndexCallback(369, hitLava, this);
}

var line;
var column;



function update() {

    for (var i=0; i<wizard.length; i++) {
        if (wizard[i].isOnLava())
            wizard[i].friction = 0.5;
        else
            wizard[i].friction = 1;
    }

    if (game.input.mousePointer.isDown) {
        clickedPoint = new Phaser.Point(game.input.x, game.input.y);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        wizard[0].castSpell("fireball");
    }

}

function render() {
    game.debug.text('[' + line + "," + column + "]", 32, 32);
    game.debug.text('pointClicked: ' + clickedPoint, 32, 64);
    //game.debug.geom(point, 'rgba(255,255,255,1)');
}







