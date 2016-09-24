/**
 * Created by sambr on 24/09/2016.
 */
var Player = function(id){
    this.x = 250;
    this.y = 250;
    this.veloX = 0;
    this.veloY = 0;
    this.id = id;
}

Player.prototype.updatePosition = function()
{
    this.x += this.veloX;
    this.y += this.veloY;

}

Player.prototype.updatePlayer = function()
{
    this.updatePosition();
}

