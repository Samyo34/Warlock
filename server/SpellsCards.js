/**
 * Class for the spellcard fireball
 */
var fireballCard = function(parent) {
	this.name = "fireball";
	this.parent = parent;

	this.key = "A";

    this.damages = 10;
    this.speed = 10;
    this.range = 32;
    this.action = 2;
    this.actionTime = 50000;

	this.isClickNeeded = true;

    // Cooldowns :
    this.cd = 100;
	this.cdCurrent = 0;
    this.cdProgress = 0;

    this.rangeAction = null;
    this.lifeTime = 100;
};

fireballCard.prototype.cast = function(aimGoalPoint) {
	// Let's update the cd
	this.cdCurrent = this.cd;

	return new fireBall(this.parent,
                        aimGoalPoint,
                        this.damages,
                        this.speed,
                        this.range,
                        this.action,
                        this.actionTime,
                        this.lifeTime);
};

fireballCard.prototype.updateCooldown = function() {
	this.cdCurrent -= 1;
	if(this.cdCurrent < 0) // cooldown is finished
	{
		this.cdCurrent = 0;
	}
	else
	{
		this.cdProgress = this.cdCurrent/this.cd;
		//console.log(this.cdProgress)
	}
};

/**
 * Class for the spellcard blink
 */
var blinkCard = function(parent) {
    this.name = "blink";
    this.parent = parent;

	this.key = "Z";

    this.rangeAction = 100;

	this.isClickNeeded = true;

	// Cooldowns :
	this.cd = 100;
	this.cdCurrent = 0;
	this.cdProgress = 0;
};

blinkCard.prototype.updateCooldown = function() {
	this.cdCurrent -= 1;
	if(this.cdCurrent < 0) // cooldown is finished
	{
		this.cdCurrent = 0;
	}
	else
	{
		this.cdProgress = this.cdCurrent/this.cd;
	}
};

blinkCard.prototype.cast = function(aimGoalPoint) {
    // Let's update the cd
    this.cdCurrent = this.cd;

    return new blink(this.parent,aimGoalPoint);
};

/**
 * Class for the spellcard lightning
 */
var lightningCard = function(parent) {
	this.name = "lightning";
	this.parent = parent;

	this.key = "E";

	this.damages = 10;
	this.speed = 30;
	this.range = 32;
	this.action=2;
	this.actionTime = 50000;
	this.lifeTime = 5;

	this.isClickNeeded = true;

	// Cooldowns :
	this.cd = 100;
	this.cdCurrent = 0;
	this.cdProgress = 0;
	this.rangeAction = null;

};

lightningCard.prototype.updateCooldown = function() {
	this.cdCurrent -= 1;
	if(this.cdCurrent < 0) // cooldown is finished
	{
		this.cdCurrent = 0;
	}
	else
	{
		this.cdProgress = this.cdCurrent/this.cd;
	}
};

lightningCard.prototype.cast = function(aimGoalPoint) {
    // Let's update the cd
    this.cdCurrent = this.cd;

    return new lightning(this.parent,
                         aimGoalPoint,
                         this.damages,
                         this.speed,
                         this.range,
                         this.action,
                         this.actionTime,
                         this.lifeTime);
};

/**
 * Class for the spellcard scurge
 */
var scurgeCard = function(parent) {
	this.name = "scurge";
	this.parent = parent;

	this.key = "R";

	this.damages = 10;
	this.lifeTime = 5;

	this.isClickNeeded = false;

	// Cooldowns :
	this.cd = 100;
	this.cdCurrent = 0;
	this.cdProgress = 0;
	this.range = parent.size * 4;
	this.rangeAction = null;
	this.action = 3;
	this.actionTime = 50000;
};

scurgeCard.prototype.cast = function() {
    // Let's update the cd
    this.cdCurrent = this.cd;

    return new scurge(this.parent, this.damages, this.lifeTime,this.range, this.action, this.actionTime);
};

scurgeCard.prototype.updateCooldown = function() {
	this.cdCurrent -= 1;
	if(this.cdCurrent < 0) // cooldown is finished
	{
		this.cdCurrent = 0;
	}
	else
	{
		this.cdProgress = this.cdCurrent/this.cd;
	}
};
