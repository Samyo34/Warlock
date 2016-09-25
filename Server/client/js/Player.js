/**
 * Created by sambr on 24/09/2016.
 */
var Player = function(id){
    this.x = 250;
    this.y = 250;
    this.veloX = 0;
    this.veloY = 0;
    this.id = id;
    this.goalDest = {
        x:0,
        y:0
    };
};

Player.prototype.updatePosition = function()
{
    if(Math.abs(this.x - this.goalDest.x) <= 2 && Math.abs(this.y - this.goalDest.y) <= 2 ){
        this.veloX=0;
        this.veloY=0;
    }
    else {
        this.x += this.veloX;
        this.y += this.veloY;
    }

};

Player.prototype.updatePlayer = function()
{
    this.updatePosition();
};

Player.prototype.setGoalDest = function(destX,destY){
    this.goalDest.x = destX;
    this.goalDest.y = destY;
    var vector = getDirection(this.x,this.y,destX,destY);
    this.veloX = vector.x;
    this.veloY = vector.y;
    console.log('velocity : '+destX+':'+destY);
};

// MATH
var getDirection = function(x1, y1, x2, y2){
    var distx = Math.abs(x2 - x1);
    var disty = Math.abs(y2 - y1);
    var px = distx/(distx + disty);
    console.log('getDirection : '+x1+':'+x2+'|'+x2+':'+y2);
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