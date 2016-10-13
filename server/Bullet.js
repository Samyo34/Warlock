var Bullet = function(parent, name, aimGoalPoint, damages){
	console.log("New bullet")

	var self = Entity();
	self.id = Math.random();
	self.parent = parent;

	self.x = parent.x + 16*Math.cos(parent.rotation);
	self.y = parent.y + 16*Math.sin(parent.rotation);

	self.angle =  Math.atan2(aimGoalPoint.y - self.parent.y, aimGoalPoint.x - self.parent.x);
	self.spdX = Math.cos(self.angle) * 10;
	self.spdY = Math.sin(self.angle) * 10;

	self.damages = damages;

	self.timer = 0;
	self.toRemove = false;

    self.action = 2;
    self.actionTime = 50000;

	var super_update = self.update;
	self.update = function(){
		if(self.timer++ > 100)
			self.toRemove = true;
		super_update();
		
		for(var i in Player.list){
			var p = Player.list[i];
			if(self.getDistance(p) < 32 && self.parent.id !== p.id) {
				// bullet self touches player p: handle collision. ex: hp--;
				p.hp -= self.damages;
				self.toRemove = true;
                var direction = Math.atan2(self.y - p.y,self.x - p.x);
                p.enemySpellActionVelocity.x = -self.action * Math.cos(direction);
                p.enemySpellActionVelocity.y = -self.action * Math.sin(direction);
                p.actionDuration = self.actionTime;
                var d = new Date();
                p.time = d.getTime();
                p.actionTime =p.time + self.actionTime;
                console.log('collision '+ self.action);
			}
		}
	};
	
	self.getInitPack = function(){
		return {
			id:self.id,
			type:self.type,
			x:self.x,
			y:self.y,
			orientation:Math.atan2(aimGoalPoint.y - self.parent.y, aimGoalPoint.x - self.parent.x),
		};
	};

	self.getUpdatePack = function(){
		return {
			id:self.id,
			name:self.name,
			x:self.x,
			y:self.y,
			orientation:Math.atan2(aimGoalPoint.y - self.parent.y, aimGoalPoint.x - self.parent.x),
		};
	};

	Bullet.list[self.id] = self;

	initPack.bullet.push(self.getInitPack());
	
	return self;
};

Bullet.list = {};

Bullet.update = function(){
	var pack = [];
	for(var i in Bullet.list){
		var bullet = Bullet.list[i];
		bullet.update();
		if(bullet.toRemove){
			delete Bullet.list[i];
			removePack.bullet.push(bullet.id);
		} else
			pack.push(bullet.getUpdatePack());	
	}
	return pack;
};

Bullet.getAllInitPack = function(){
	var bullets = [];
	for(var i in Bullet.list)
		bullets.push(Bullet.list[i].getInitPack());
	return bullets;
};

//======================================================================================================================
//  Our core Spell class
//  child class of Bullet class
//var Spell = [];

/*Spell.FireBall = function (x, y, parent) {

	var self = new Bullet(parent, "fireball")
	//this.indic = new SpellIndicator(game, 'fireball_spell_indicator', x, y);

	self.nextFire = 0;
	self.damage = 100;
	self.bulletSpeed = 300;
	self.fireRate = 2500;
	self.cooldown;
	self.actionRatio = 200;
	self.actionTime = 50000;
	self.nextFire = this.game.time.time + this.fireRate;

	//this.actionRatio = 200;

	return self;
};*/

var Spell = function (parent, spellDescriptor) {
	var type = spellDescriptor.spellType;
	var name = spellDescriptor.spellName;
	var aimGoalPoint = {x: spellDescriptor.x, y: spellDescriptor.y}

	if(type === "bullet") {
		var damages = spellDescriptor.damages;
		var self = Bullet(parent, name, aimGoalPoint, damages);
	}
	else if (type === "noBullet") {

	}

	return self;
};
