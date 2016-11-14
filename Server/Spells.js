var fireBall = function(parent, aimGoalPoint, damages, speed, range, action, actionTime, lifeTime)
{
	this.id = Math.random();
	this.spellName = "fireball";
	this.parent = parent;

	this.x = parent.x + 16*Math.cos(parent.rotation);
	this.y = parent.y + 16*Math.sin(parent.rotation);

	this.aimGoalPoint = aimGoalPoint

	this.angle = Math.atan2(aimGoalPoint.y - this.parent.y, aimGoalPoint.x - this.parent.x);
	this.spdX = 0;
	this.spdY = 0;

	if(this.angle !== 0)
   {
       this.spdX = Math.cos(this.angle) * speed;
       this.spdY = Math.sin(this.angle) * speed;
   }

	this.damages=damages;
   this.range=range;
   this.action=action;
   this.actionTime=actionTime;

   this.timer = 0;

   this.toRemove = false;

   bullets.BulletList[this.id] = this;
};

fireBall.prototype.update = function()
{
	if(this.timer++ > this.lifeTime)
	{
		this.toRemove = true;
	}
				
	this.x += this.spdX;
	this.y += this.spdY;
	// TODO : collisions detection
	for(var i in Player.list){
		var p = Player.list[i];
		if(this.parent.id !== p.id)
		{
			if(this.getDistance(p) < ((this.range/2) + (p.size/2))) {
			// bullet this touches player p: handle collision. ex: hp--;
             if((p.hp - this.damages)>0)
             {
                 p.hp -= this.damages;
             }
             else
             {
                 p.hp = 0;
             }

             this.toRemove = true;

             var direction = Math.atan2(this.y - p.y,this.x - p.x);
             p.enemySpellActionVelocity.x = -this.action * Math.cos(direction);
             p.enemySpellActionVelocity.y = -this.action * Math.sin(direction);
             p.actionDuration = this.actionTime;
             var d = new Date();
             p.time = d.getTime();
             p.actionTime = p.time + this.actionTime;
             //console.log('collision '+ this.action);
		}
		}
		
	}
};

fireBall.prototype.getUpdatePack = function(){

    //console.log('bullet : '+ self.x+':'+self.y+' | '+self.parent.x+':'+self.parent.y);
	return {
		id:this.id,
		spellName:this.spellName,
      parentID:this.parent.id,
		x:this.x,
		y:this.y,
		orientation:Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x),
		range:this.range,
	};
};

fireBall.prototype.getInitPack = function(){
	return {
		id:this.id,
		spellName:this.spellName,
		x:this.x,
		y:this.y,
		orientation:Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x),
      range:this.range
	};
};

fireBall.prototype.getDistance = function(pt){
		return Math.sqrt(Math.pow(this.x-pt.x,2) + Math.pow(this.y-pt.y,2));
};

var blink = function(parent, aimGoalPoint)
{
	parent.x = aimGoalPoint.x;
	parent.y = aimGoalPoint.y;
};