/**
 * Class for the spell fireBall
 */

 function getInt32Array()
 {
 	return new Int32Array(7);
 }

 (function(){
 	class fireBall{
 		constructor(parent, aimGoalPoint, damages, speed, range, action, actionTime, lifeTime){
 			this.id = Math.random();
 			this.room = parent.room;
 			this.spellName = "fireball";
 			this.spellCode = 0;
 			this.parent = parent;

 			this.x = parent.x + (range/2)*Math.cos(parent.rotation);
 			this.y = parent.y + (range/2)*Math.sin(parent.rotation);

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
 			this.lifeTime = lifeTime;

 			this.timer = 0;

 			this.toRemove = false;

 			this.room.addBullet(this);
 			this.room.initPack.bullet.push(this.getInitPack());
 		}

 		update() {
 			if(this.timer++ > this.lifeTime)
 			{
 				this.toRemove = true;
 			}

 			this.x += this.spdX;
 			this.y += this.spdY;
		// TODO : collisions detection
		for(var i in this.room.players)
		{
			var p = this.room.players[i];
			if(this.parent.id !== p.id)
			{
				if(this.getDistance(p) < ((this.range/2) + (p.size/2)))
				{
	                // bullet this touches player p: handle collision. ex: hp--;
	                if((p.hp - this.damages)>0)
	                {
	                	p.hp -= this.damages;
	                }
	                else
	                {
	                	p.hp = 0;
	                	this.parent.score++;
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
	     }

	     getUpdatePack() {

	    //console.log('bullet : '+ self.x+':'+self.y+' | '+self.parent.x+':'+self.parent.y);
	    var valuesArray = getInt32Array();
	    valuesArray[0] = parseInt(this.id*100000000);
	    valuesArray[1] = parseInt(this.spellCode);
	    valuesArray[2] = parseInt(this.parent.id*100000000);
	    valuesArray[3] = parseInt(this.x);
	    valuesArray[4] = parseInt(this.y);
	    var orientation = Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x)
	    valuesArray[5] = parseInt(orientation*100000000);
	    valuesArray[6] = parseInt(this.range);
	    //console.log('getUpdatePack '+ valuesArray.length);
	    return valuesArray;
	/*	return {
			id: this.id,
			spellName: this.spellName,
	        parentID: this.parent.id,
			x: this.x,
			y: this.y,
			orientation: Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x),
			range: this.range,
		};*/
	}

	getInitPack() {
		return {
			id: parseInt(this.id*100000000),
			spellCode: this.spellCode,
			x: this.x,
			y: this.y,
			parentID:parseInt(this.parent.id*100000000),
			orientation: Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x),
			range: this.range,
		};
	}

	getDistance(pt) {
		return Math.sqrt(Math.pow(this.x-pt.x,2) + Math.pow(this.y-pt.y,2));
	}
};

/**
 * Class for the spell blink
 */
 class blink {
 	constructor(parent, aimGoalPoint){
 		parent.x = aimGoalPoint.x;
 		parent.y = aimGoalPoint.y;
 	}
 };
/**
 * Class for the spell lightning
 */
 class lightning{
 	constructor(parent, aimGoalPoint, damages, speed, range, action, actionTime, lifeTime) {
 		this.id = Math.random();
 		this.room = parent.room;
 		this.spellName = "lightning";
 		this.spellCode = 1
 		this.parent = parent;

 		this.x = parent.x + 16*Math.cos(parent.rotation);
 		this.y = parent.y + 16*Math.sin(parent.rotation);

 		this.aimGoalPoint = aimGoalPoint;

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
 		this.lifeTime = lifeTime;

 		this.timer = 0;

 		this.toRemove = false;

 		this.room.addBullet(this);
 		this.room.initPack.bullet.push(this.getInitPack());
 	}

 	update() {
 		if(this.timer++ > this.lifeTime)
 		{
 			this.toRemove = true;
 		}

 		this.x += this.spdX;
 		this.y += this.spdY;
		// TODO : collisions detection
		for(var i in this.room.players){
			var p = this.room.players[i];
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
					this.parent.score++;
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
	 }

	 getUpdatePack() {

	    //console.log('bullet : '+ self.x+':'+self.y+' | '+self.parent.x+':'+self.parent.y);
	    var valuesArray = getInt32Array();
	    valuesArray[0] = parseInt(this.id*100000000);
	    valuesArray[1] = parseInt(this.spellCode);
	    valuesArray[2] = parseInt(this.parent.id*100000000);
	    valuesArray[3] = parseInt(this.x);
	    valuesArray[4] = parseInt(this.y);
	    var orientation = Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x)
	    valuesArray[5] = parseInt(orientation*100000000);
	    valuesArray[6] = parseInt(this.range);
	    /*console.log('lightning '+this.id);*/
	    return valuesArray;
	/*	return {
			id: this.id,
			spellName: this.spellName,
	        parentID: this.parent.id,
			x: this.x,
			y: this.y,
			orientation: Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x),
			range: this.range
		};*/
	}

	getInitPack() {
		return {
			id: parseInt(this.id*100000000),
			spellCode: this.spellCode,
			parent: parseInt(this.parent.id*100000000),
			x: this.x,
			y: this.y,
			orientation: Math.atan2(this.aimGoalPoint.y - this.parent.y, this.aimGoalPoint.x - this.parent.x),
			range: this.range,
			lifeTime:this.lifeTime,
		};
	}


	getDistance(pt) {
		return Math.sqrt(Math.pow(this.x-pt.x,2) + Math.pow(this.y-pt.y,2));
	}
};

/**
 * Class for the spell scurge
 */
 class scurge {
 	constructor(parent, damages, lifeTime,range,action,actionTime){
 		this.id = Math.random();
 		this.room = parent.room;
 		this.x = parent.x;
 		this.y = parent.y;
 		this.spellName = "scurge";
 		this.spellCode = 2;
 		this.parent = parent;
 		this.damages = damages;
 		this.lifeTime = lifeTime;
 		this.range = range;
 		this.action = action;
 		this.actionTime = actionTime;
 		this.toRemove = false;

 		this.timer = 0;

 		this.playerTouched = [];

 		this.room.addBullet(this);
 		this.room.initPack.bullet.push(this.getInitPack());
 	}

 	update() {
 		this.x = this.parent.x;
 		this.y = this.parent.y;

 		if(this.timer++ > this.lifeTime)
 		{
 			this.toRemove = true;
 		}
 		for(var i =0; i<this.room.players.length;i++){
 			var p = this.room.players[i];
 			if(this.parent.id !== p.id)
 			{
 				if(this.getDistance(p) < ((this.range/2) + (p.size/2))) {
				// bullet this touches player p: handle collision. ex: hp--;
				var isTouched = false;
				for(var j =0;j< this.playerTouched.length;j++)
				{
					if(p.id === this.playerTouched[j])
					{
						isTouched = true;
					}
				}
				if(isTouched)
				{
					return;
				}
				this.playerTouched.push(p.id);
				if((p.hp - this.damages)>0)
				{
					p.hp -= this.damages;
				}
				else
				{
					p.hp = 0;
					this.parent.score++;
				}

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
	 }

	 getUpdatePack() {

	    //console.log('bullet : '+ self.x+':'+self.y+' | '+self.parent.x+':'+self.parent.y);
	    var valuesArray = getInt32Array();
	    valuesArray[0] = parseInt(this.id*100000000);
	    valuesArray[1] = parseInt(this.spellCode);
	    valuesArray[2] = parseInt(this.parent.id*100000000);
	    valuesArray[3] = parseInt(this.parent.x);
	    valuesArray[4] = parseInt(this.parent.y);
	    valuesArray[5] = parseInt(0);
	    valuesArray[6] = parseInt(this.range);
	    return valuesArray;
	/*	return {
			id: this.id,
			spellName: this.spellName,
	        parentID: this.parent.id,
			x: this.x,
			y: this.y,
			orientation: 0,
			range: this.range
		};*/
	}

	getInitPack() {
		return {
			id: parseInt(this.id*100000000),
			spellCode: this.spellCode,
			parent: parseInt(this.parent.id*100000000),
			x: this.parent.x,
			y: this.parent.y,
			orientation: 0,
			range: this.range,
			lifeTime:this.lifeTime,
		};
	}

	getDistance(pt) {
		return Math.sqrt(Math.pow(this.x-pt.x,2) + Math.pow(this.y-pt.y,2));
	}
}

module.exports.spells = {fireBall : fireBall , lightning : lightning, blink, blink,scurge : scurge};

})();



