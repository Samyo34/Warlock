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
   this.rangeAction = 0;

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