var fireballCard = function(parent)
{
	this.name = "fireball";
	this.parent = parent;

   this.damages = 10;
   this.speed = 10;
   this.range=32;
   this.action=2;
   this.actionTime=50000;
   this.cd=5;
   this.rangeAction = null;

   this.timer = 0;
	this.lifeTime = 100;
	this.toRemove = false;
};

fireballCard.prototype.cast = function(aimGoalPoint)
{
	return new fireBall(this.parent,
		aimGoalPoint,
		this.damages,
		this.speed,
		this.range,
		this.action,
		this.actionTime,
		this.lifeTime);
};

var blinkCard = function(parent)
{
	this.name = "blink";
	this.parent = parent;

	this.rangeAction = 100;
	this.cd = 5;
};

blinkCard.prototype.cast = function(aimGoalPoint)
{
	return new blink(this.parent,aimGoalPoint);
};