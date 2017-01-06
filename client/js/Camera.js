/**
 * Created by sambr on 24/10/2016.
 */
var Camera = function(ctx)
{
    // top left of the viewPort
    this.x = 0;
    this.y = 0;

    //dimensions of the viewPort
    this.width = ctx.canvas.clientWidth;
    this.height = ctx.canvas.clientHeight;
    console.log("LOOOOOOOOOOOOL" + this.width)
   // console.log('camera set : '+this.x+':'+this.y + ' | '+ this.width +'/'+this.height);

};

Camera.prototype.moveTo = function(x,y)
{
    this.x = x - this.width/2;
    this.y = y - this.width/2;
    //console.log('camera moved : '+this.x+':'+this.y+' || '+this.width+':'+this.width);
};


Camera.prototype.setDimensions = function(width, height)
{
    this.width = width;
    this.height = height;
    //console.log('camera moved : '+this.x+':'+this.y+' || '+this.width+':'+this.width);
};