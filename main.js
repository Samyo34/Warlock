//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 800, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

var GlobalPosi;
var goalDestination;
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

    // for FPS :
    game.time.advancedTiming = true;

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
    game.load.image('target', 'spellarea.png');
    game.load.image('fireball_spell_indicator', 'fireball-red-3.png');
    game.load.image('spell_border', 'spell_border.png');
}

var map;
var layer;
var wizard = [];
var target;
var fireball_indicator;

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
    goalDestination = new Phaser.Point(GlobalPosi.x, GlobalPosi.y);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

    // for capturing left and right mouse clicks:
    game.input.mouse.capture = true;

    // I don't know yet why, but this disables the popup which appears after a right click on the web page
    game.canvas.oncontextmenu = function (e) { e.preventDefault();};

    // Try for collisions:
    //map.setCollision([368, 369, 370]);
    //circle.body.collideWorldBounds = true;

    //map.setCollision(369);


    //=========== WIZARDS ======================
    // We add in the spell array the fireball
    //Wizard.push(new Wizard(game));
    //var lol = new Wizard(game);
    //game.add.existing(lol);
    wizard[0] = new Wizard(game, GlobalPosi.x, GlobalPosi.y, 65, 65);
    wizard[0].isActive = true;
    wizard[1] = new Wizard(game, 300, 300, 400, 65);
    wizard[1].isActive = true;
    //wizard[2] = new Wizard(game, 500, 600);
    //wizard[2].isActive = true;

    wizard[1].isShooting = true;
    wizard[1].autoShoot = true;
    //=========== SPELLS ======================
    // We add in the spell array the fireball
    //Spell.push(new Spell.FireBall(game));

    //for (var i = 1; i < Spell.length; i++)
    //{
    //    Spell[i].visible = false;
    //}

    //  This will set Tile ID 368 (the lava) to call the hitLava function when collided with
    //map.setTileIndexCallback(373, hitGround, this);
    //map.setTileIndexCallback(369, hitLava, this);

    game.input.mouse.mouseDownCallback = function(){
        wizard[0].isOrientationGood = false;
        if(game.input.mouse.button === Phaser.Mouse.RIGHT_BUTTON)
        {
            console.log("Right click")
            goalDestination = new Phaser.Point(game.input.x, game.input.y);
            wizard[0].goalDest = goalDestination;
            wizard[0].currentSpeed = wizard[0].SPEED;
        }

        if(target.visible && game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON)
        {
            console.log("Left click")
            wizard[0].isShooting = true;
            wizard[0].aimGoalPoint = new Phaser.Point(game.input.x, game.input.y);
            wizard[0].prepareSpell("fireball");
            target.visible = false;
        }
    };

    game.input.keyboard.onDownCallback = function( e ){
        if(e.keyCode == Phaser.Keyboard.A){
            target.visible = true;
        }
    };

    game.input.keyboard.onUpCallback = function( e ){
        if(e.keyCode == Phaser.Keyboard.A){
            target.visible = false;
        }
    };

    // Sprite which will be display as a target for casting a spell
    target = game.add.sprite(0, 0, 'target');
    target.anchor.set(0.5);
    target.scale.set(0.1);
    target.visible = false;

}

var line;
var column;

function update() {
    target.x = game.input.x;
    target.y = game.input.y;
   // wizard[1].isShooting = true;

    game.physics.arcade.overlap(wizard[1].Spell[0],wizard[0],onHit,processOverlap,this);
    game.physics.arcade.overlap(wizard[0].Spell[0],wizard[1],onHit,processOverlap,this);
    //game.physics.arcade.collide(Spell[i],wizard[j],onHit);

    for (var i=0; i<wizard.length; i++)
    {
        if (wizard[i].isOnLava())
            wizard[i].friction = 0.5;
        else
            wizard[i].friction = 1;
    }
}

function render() {
    //game.debug.text('goalDestination: ' + goalDestination, 32, 64);
    //game.debug.geom(point, 'rgba(255,255,255,1)');
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    game.debug.text(wizard[0].health, 200, 100, "#00ff00");
    /*game.debug.body(wizard[1]);*/
}

function processOverlap(wizard,spell)
{
    console.log('Collison detected');
    if (wizard.isDead) // if the wizard is dead, we don't collide
        return false;
    return true;
}

function onHit(wizard,spell)
{
    wizard.onHit(spell);
    return false;
}






