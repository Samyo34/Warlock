/**
 * Created by sambr on 24/09/2016.
 */
var Player = function(id){
    this.x = 250;
    this.y = 250;
    this.veloX = 0;
    this.veloY = 0;
    this.id = id;
    this.rotation = 0;
    this.angularVelocity =0;
    this.isOrientationGood = true;

    this.goalDest = {
        x:this.x,
        y:this.y
    };

    this.isDead = false;

    this.fullHealth = 200;
    this.health = 200;

    this.SPEED = 10;

    this.friction = 1;
    this.currentSpeed = 0;
    this.isActive = true;

    this.spellsToCast = [];
    this.spellActionVelocity = {
        x:0,
        y:0
    };

    this.aimGoalPoint = {
        x:this.x+200,
        y:this.y
    };

    this.actionTime = 0;
    this.ratioSpeed = 1;
    this.actionDuration = 0;

    this.autoShoot = false;

  //  this.healthBar = new HealthBar(game, {x: x, y: y-25, width: 40, height : 5});

    this.Spell = [];
   //this.Spell.push(new Spell.FireBall(game, xSpellIndic, ySpellIndic));
};

Player.prototype.updatePosition = function()
{
    if(Math.abs(this.x - this.goalDest.x) <= 4 && Math.abs(this.y - this.goalDest.y) <= 4 )
    {
        this.veloX=0;
        this.veloY=0;
        this.currentSpeed =0;
    }
    else
    {
        this.veloX = this.friction * this.currentSpeed * Math.cos(this.rotation) + this.spellActionVelocity.x;
        this.veloY = this.friction * this.currentSpeed * Math.sin(this.rotation) + this.spellActionVelocity.y;
    }

    angleDesired = Math.atan2(this.goalDest.y - this.y, this.goalDest.x - this.x);

    // we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
    var error = angleDesired - this.rotation;
    console.log(error+ ' '+ angleDesired+ ' '+ this.rotation);
    // If the error is small enough, we set the angular velocity to zero
    if (Math.abs(error) <= 0.001)
    {
        this.angularVelocity = 0;
        this.isOrientationGood = true;
    }
    else
    {
        error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]

        this.angularVelocity = /*K * */error; // we multiply the error by a gain K in order to converge faster
    }

/*
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
    }*/

    this.x += this.veloX;
    this.y += this.veloY;
    this.rotation = this.rotation;

    this.rotation += this.angularVelocity;

};

Player.prototype.updatePlayer = function()
{
    this.updatePosition();
};

Player.prototype.setGoalDest = function(destX,destY){
    this.goalDest.x = destX;
    this.goalDest.y = destY;
    var vector = getDirection(this.x,this.y,destX,destY);
/*    this.veloX = vector.x;
    this.veloY = vector.y;*/
};

// MATH
var getDirection = function(x1, y1, x2, y2){
    var distx = Math.abs(x2 - x1);
    var disty = Math.abs(y2 - y1);
    var px = distx/(distx + disty);
    var py = 1 - px;
    var signex = 1;
    if(x2 < x1){
        signex = -1;
    }
    var signey = 1;
    if(y2 < y1){
        signey = -1;
    }
    return {"x":px*signex,"y":py*signey};
};