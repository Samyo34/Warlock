//======================================================================================================================
//  Our core Bullet class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Spell classes

var Bullet = function (game, key, actionRatio, actionDuring, damage) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

    this.damage = damage;

    this.action = actionRatio;
    this.actionTime = actionDuring;

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

Spell.FireBall = function (game, x, y) {

    Phaser.Group.call(this, game, game.world, 'FireBall', false, true, Phaser.Physics.ARCADE);
    this.indic = new SpellIndicator(game, 'fireball_spell_indicator', x, y);
    //this.indic.pie.progress = 0;

    this.nextFire = 0;
    this.damage = 100;
    this.bulletSpeed = 300;
    this.fireRate = 2500;
    this.cooldown;
    this.actionRatio = 200;
    this.actionTime = 50000;

    //this.actionRatio = 200;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'i_fireball',this.actionRatio, this.actionTime, this.damage), true);
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

Spell.FireBall.prototype.update = function () {
    if (this.game.time.time < this.nextFire) {
        this.cooldown = this.nextFire - this.game.time.time ;
        this.indic.pie.progress = 1- (((100*this.cooldown)/this.fireRate) /100);
    }
    else
    {
        this.indic.pie.progress = 1;
    }
};

//======================================================================================================================
//  SpellIndicator object
//  This is a simple Sprite object which manages the display of the spell indicator and its cooldown

SpellIndicator = function (game, key, x, y) {
    // the elements are added to the group in the order that we want them to be displayed
    Phaser.Group.call(this, game);//, game.world, 'FireBall', false, true, Phaser.Physics.ARCADE);

    // TBD more clean
    var spellIndicator = this.create(x, y, key);
    spellIndicator.scale.setTo(0.2);
    spellIndicator.anchor.setTo(0.5);

    this.pie = this.add(new PieProgress(game, x, y, 37, 'rgba(255,255,255,0.5)'));

    var spellBorder = this.create(x, y, 'spell_border');
    spellBorder.scale.setTo(0.2);
    spellBorder.anchor.setTo(0.5);

    /*this.setAll('anchor.x', 0.5);
    this.setAll('anchor.y', 0.5);
    this.setAll('scale.x', 0.2);
    this.setAll('scale.y', 0.2);*/
};

SpellIndicator.prototype = Object.create(Phaser.Group.prototype);
SpellIndicator.prototype.constructor = SpellIndicator;

SpellIndicator.prototype.update = function () {

};

//======================================================================================================================
//  Our core Wizard class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Spell classes
Wizard = function (game, x, y, xSpellIndic, ySpellIndic) {

    // creation of the sprite:
    Phaser.Sprite.call(this, game, x, y, 'sorcier');
    //Phaser.Group.call(this, game, game.world, 'sorcier', false, true, Phaser.Physics.ARCADE);

    game.physics.enable(this,Phaser.Physics.ARCADE);
    this.body.velocity.setTo(0, 0);

    this.anchor.setTo(0.5, 0.5);
    game.add.existing(this);

    this.isDead = false;

    this.fullHealth = 200;
    this.health = 200;

    this.SPEED = 100;

    this.friction = 1;
    this.currentSpeed = 0;
    this.isActive = true;
    this.isOrientationGood = true;
    this.spellsToCast = [];
    this.spellActionVelocity = new Phaser.Point(0,0);

    this.aimGoalPoint = new Phaser.Point(this.position.x+200,this.position.y);

    this.goalDest = new Phaser.Point(this.body.position.x,this.body.position.y);

    this.actionTime = 0;
    this.ratioSpeed = 1;
    this.actionDuration = 0;

    this.autoShoot = false;

   // this.healthBar = new HealthBar(game, {x: x, y: y-25, width: 40, height : 5});

    this.Spell = [];
    this.Spell.push(new Spell.FireBall(game, xSpellIndic, ySpellIndic));
};

Wizard.prototype = Object.create(Phaser.Sprite.prototype);
Wizard.prototype.constructor = Wizard;

Wizard.prototype.update = function() {
    // Check the health:
    if (this.health <= 0)
    {
        this.health = 0;
        this.isDead = true;
        //this.healthBar.kill();
        this.visible = false;
    }
    else if(this.isActive)
    {
        // Check if the wizard is on the lava:
        var line = Math.floor(this.x / TILE_WIDTH);
        var column = Math.floor(this.y / TILE_HEIGHT);

        var indexInMapArray = column*25 + line;
        if (map_array[indexInMapArray] == LAVA) // player on lava
        {
            this.friction = 0.5;
            this.health -= 0.5;
        }
        else
        {
            this.friction = 1;
        }

        if(this.autoShoot)
        {
            this.prepareSpell('fireball');
        }
        if(this.game.time.time < this.actionTime)
        {
            var cd = this.actionTime - this.game.time.time;
            //console.log('action time '+ this.actionTime + ' '+ this.game.time.time);
            this.ratioSpeed =  (((100*cd)/this.actionDuration) /100);
            this.spellActionVelocity.setTo((this.spellActionVelocity.x*this.ratioSpeed),(this.spellActionVelocity.y*this.ratioSpeed));
            //console.log('ratio speed ' + ((100*cd)/this.actionTime));
            //console.log('ratio ' +   this.ratioSpeed );
            //this.scale.setTo(this.scale.x -(1-(((100*cd)/this.actionDuration) /100)),this.scale.y-(1-(((100*cd)/this.actionDuration) /100)));
        }
        if (this.isShooting) // we turn the wizard toward the aimGoalPoint
        {
            this.body.velocity.setTo(0, 0);

            if(this.isOrientationGood)
            {
                this.castSpell();
                if(this.autoShoot == false)
                {
                    this.isShooting = false;
                }
            }

            //================ Update rotation ================
            // we compute the desiredAngle towards the clicked point (in radians)
            angleDesired = Math.atan2(this.aimGoalPoint.y - this.y, this.aimGoalPoint.x - this.x);

            // we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
            var error = angleDesired - this.rotation;

            // If the error is small enough, we set the angular velocity to zero
            if (Math.abs(error) <= 0.001)
            {
                this.body.angularVelocity = 0;
                this.isOrientationGood = true;
            }
            else
            {
                error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
                this.body.angularVelocity = K * error; // we multiply the error by a gain K in order to converge faster
            }
        }
        else // we move and turn normaly
        {
            //================ Update movement ================
            // If the wizard is in close enough (2px) from the clicked point => velocity = 0

            if ((Math.abs(this.position.x - this.goalDest.x) <= 7 && Math.abs(this.position.y - this.goalDest.y) <= 7 ))
            {
                this.body.velocity.setTo(this.spellActionVelocity.x, this.spellActionVelocity.y);
                this.currentSpeed =0;
            }
            else  // else we set up the velocity
            {
                //console.log(this.currentSpeed);
                this.body.velocity.setTo(this.friction * this.currentSpeed * Math.cos(this.rotation)+this.spellActionVelocity.x, this.friction * this.currentSpeed * Math.sin(this.rotation)+this.spellActionVelocity.y);
            }
            //================ Update rotation ================
            // we compute the desiredAngle towards the clicked point (in radians)
            angleDesired = Math.atan2(this.goalDest.y - this.y, this.goalDest.x - this.x);

            // we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
            var error = angleDesired - this.rotation;

            // If the error is small enough, we set the angular velocity to zero
            if (Math.abs(error) <= 0.001)
            {
                this.body.angularVelocity = 0;
                this.isOrientationGood = true;
            }
            else
            {
                error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
                this.body.angularVelocity = K * error; // we multiply the error by a gain K in order to converge faster
            }
        }
    }

    // Update the position and the progress of the healthBar:
    //this.healthBar.setPosition(this.x, this.y - 25);
    //this.healthBar.setPercent((100 * this.health) / this.fullHealth);

};

Wizard.prototype.castSpell = function() {
    if(this.spellsToCast.length > 0)
    {
        this.Spell[this.spellsToCast[0]].fire(this);
        this.spellsToCast.shift();
    }
};

Wizard.prototype.prepareSpell = function(name) {
    if(name == "fireball")
        this.spellsToCast.push(0);
};

Wizard.prototype.isOnLava = function() {

    return false
};

Wizard.prototype.onHit = function(source) {
    var direction = Math.atan2(this.body.position.y - source.body.position.y,this.body.position.x - source.body.position.x);
    this.actionDuration = source.actionTime;
    this.actionTime = this.game.time.time + source.actionTime;
    this.spellActionVelocity.x = source.action * Math.cos(direction);
    this.spellActionVelocity.y = source.action * Math.sin(direction);
   // this.scale.setTo(this.scale.x +1,this.scale.y+1);
    console.log(source.bulletSpeed)
    this.health = this.health - source.damage;
    //console.log(source)
    source.kill();
};


//======================================================================================================================
//  Our core Wizard class
//  This is a simple Sprite object that we set a few properties on
//  It is fired by all of the Spell classes
var PieProgress = function(game, x, y, radius, color, angle) {
    this._radius = radius;
    this._progress = 1;
    this.bmp = game.add.bitmapData(radius * 2, radius * 2);
    Phaser.Sprite.call(this, game, x, y, this.bmp);

    this.anchor.set(0.5);
    this.angle = angle || -90;
    this.color = color || "#fff";
    this.updateProgress();
}

PieProgress.prototype = Object.create(Phaser.Sprite.prototype);
PieProgress.prototype.constructor = PieProgress;

PieProgress.prototype.updateProgress = function() {
    var progress = this._progress;
    progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);

    this.bmp.clear();
    this.bmp.ctx.fillStyle = this.color;
    this.bmp.ctx.beginPath();
    this.bmp.ctx.arc(this._radius, this._radius, this._radius, 0, (Math.PI * 2) * progress, true);
    this.bmp.ctx.lineTo(this._radius, this._radius);
    this.bmp.ctx.closePath();
    this.bmp.ctx.fill();
    this.bmp.dirty = true;
}

Object.defineProperty(PieProgress.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(val) {
        this._radius = (val > 0 ? val : 0);
        this.bmp.resize(this._radius * 2, this._radius * 2);
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'progress', {
    get: function() {
        return this._progress;
    },
    set: function(val) {
        this._progress = Phaser.Math.clamp(val, 0, 1);
        this.updateProgress();
    }
});
