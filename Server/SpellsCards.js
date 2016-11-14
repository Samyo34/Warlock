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
	this.lifeTime = 100;
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


var lightningCard = function(parent)
{
	this.name = "lightning";
	this.parent = parent;

	this.damages = 10;
	this.speed = 30;
	this.range = 32;
	this.action=2;
	this.actionTime = 50000;
	this.lifeTime = 5;
	this.cd = 5000;
	this.rangeAction = null;

};

lightningCard.prototype.cast = function(aimGoalPoint)
{
	return new lightning(this.parent,
		aimGoalPoint,
		this.damages,
		this.speed,
		this.range,
		this.action,
		this.actionTime,
		this.lifeTime);
};

var scurgeCard = function(parent)
{
	this.name = 'scurge';
	this.parent = parent;

	this.damages = 10;
	this.lifeTime = 10;
	this.cd = 5000;
	this.range = parent.size * 4;
	this.rangeAction = null;
	this.action = 3;
	this.actionTime = 50000;
};

scurgeCard.prototype.cast = function(aimGoalPoint)
{
	return new scurge(this.parent, this.damages, this.lifeTime,this.range, this.action, this.actionTime);
}

