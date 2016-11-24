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

Player.prototype.updatePlayer = function()
{
    updatePosition();
}

Player.prototype.updatePosition = function()
{
    this.x += veloX;
    this.y += veloY;

}