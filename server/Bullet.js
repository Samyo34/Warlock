
/* Spells' parameters in JSON*/
var SpellsParam = function(){

    this.spellArray = [];

    this.spellArray.push(
        {
        name:'fireball',
        damage:10,
        spellType:'bullet',
        range:32,
        action:2,
        actionTime:50000,
        cd:5
    });

    this.spellArray.push(
        {
        name:'blink',
        spellType:'noBullet',
        range:100,
        cd:10
        }
    );

    this.getParams = function(name)
    {
        for(var i in this.spellArray)
        {
            if(this.spellArray[i].name === name)
            {
                return this.spellArray[i];
            }
        }
    };

    return this;
};



var Bullet = function(){
    this.BulletList = {};
	//console.log("New bullet "+parent.x+':'+parent.y+' '+parent.rotation );
/*
	var self = Entity();
	self.id = Math.random();
	self.spellName = name;
	self.parent = parent;

	self.x = parent.x + 16*Math.cos(parent.rotation);
	self.y = parent.y + 16*Math.sin(parent.rotation);

	self.angle = Math.atan2(aimGoalPoint.y - self.parent.y, aimGoalPoint.x - self.parent.x);
    if(self.angle === 0)
    {
        self.spdX = 0;
        self.spdY = 0;
    }
    else
    {
        self.spdX = Math.cos(self.angle) * speed;
        self.spdY = Math.sin(self.angle) * speed;
    }
    //console.log(self.spdX+':'+self.spdY+' '+self.angle);

	self.damages = damages;

	self.timer = 0;
	self.lifeTime = lifeTime;
	self.toRemove = false;

    self.range = 32;

    self.action = 2;
    self.actionTime = 50000;

	//console.log("LOl")
	//console.log(lifeTime)
	var super_update = self.update;
	self.update = function(){

		//if(self.timer++ > self.range)
		if(self.timer++ > self.lifeTime)
			self.toRemove = true;
		super_update();
		for(var i in Player.list){
			var p = Player.list[i];
			if(self.getDistance(p) < ((self.range/2) + (p.size/2))  && self.parent.id !== p.id) {
				// bullet self touches player p: handle collision. ex: hp--;
                if((p.hp - self.damages)>0)
                {
                    p.hp -= self.damages;
                }
                else
                {
                    p.hp = 0;
                }

                self.toRemove = true;

                var direction = Math.atan2(self.y - p.y,self.x - p.x);
                p.enemySpellActionVelocity.x = -self.action * Math.cos(direction);
                p.enemySpellActionVelocity.y = -self.action * Math.sin(direction);
                p.actionDuration = self.actionTime;
                var d = new Date();
                p.time = d.getTime();
                p.actionTime = p.time + self.actionTime;
                //console.log('collision '+ self.action);
			}
		}
	};
	
	self.getInitPack = function(){
		return {
			id:self.id,
			spellName:self.spellName,
			type:self.type,
			parentID:self.parent["id"],
			x:self.x,
			y:self.y,
			orientation:Math.atan2(aimGoalPoint.y - self.parent.y, aimGoalPoint.x - self.parent.x),
            range:self.range
		};
	};

	self.getUpdatePack = function(){
	    //console.log('bullet : '+ self.x+':'+self.y+' | '+self.parent.x+':'+self.parent.y);
		return {
			id:self.id,
			spellName:self.spellName,
            type:self.type,
            parentID:self.parent["id"],
			x:self.x,
			y:self.y,
			orientation:Math.atan2(aimGoalPoint.y - self.parent.y, aimGoalPoint.x - self.parent.x),
			range:self.range,
		};
	};

	Bullet.list[self.id] = self;

	initPack.bullet.push(self.getInitPack());
	
	return self;*/
};

//Bullet.list = {};

Bullet.prototype.update = function(){
    var sizeBufferBullet = 4*7;
    var sizeBuffer = (sizeBufferBullet*Object.keys(this.BulletList).length);
    var arrayBufferAllBullet = new ArrayBuffer(sizeBuffer);
    var viewArrayBufferAllPlayer = new Int32Array(arrayBufferAllBullet);
    var indexBullet = 0;
    for(var i in this.BulletList)
    {
        var bullet =  this.BulletList[i];
        bullet.update();
        var updatePack = bullet.getUpdatePack();
        for (var j = 0;j<updatePack.length;j++)
        {
            viewArrayBufferAllPlayer[(indexBullet*updatePack.length)+j]=updatePack[j];
        }
        indexBullet++;

        if(bullet.toRemove)
        {
            delete this.BulletList[i];
            removePack.bullet.push(bullet.id)
        }
    }
    //console.log('bullets '+arrayBufferAllBullet.byteLength);
    return arrayBufferAllBullet;

/*	var pack = [];
	for(var i in this.BulletList){
		var bullet = this.BulletList[i];
		bullet.update();
		if(bullet.toRemove){
			delete this.BulletList[i];
			removePack.bullet.push(bullet.id);
            console.log('remove bullet');
		} else
			pack.push(bullet.getUpdatePack());	
	}
	return pack;*/
};

Bullet.prototype.getAllInitPack = function(){
	var bullets = [];
	for(var i in this.BulletList)
		bullets.push(this.BulletList[i].getInitPack());
	return bullets;
};

function pushBuffer(buffer, array,index)
{
    var viewArrayBuffer = new Int32Array(buffer);
    var sizePlayer = array.length;
    for (var i = 0;i<sizePlayer;i++)
    {
        viewArrayBuffer[index*sizePlayer+i+1]=array[i];
    }
};

/*var Spell = function (parent, spellDescriptor) {
	var type = spellDescriptor.spellType;
	var name = spellDescriptor.spellName;
	var cooldown = spellDescriptor.cooldown;
	var aimGoalPoint = {x: spellDescriptor.x, y: spellDescriptor.y};

	if(type === "bullet") {
		var damages = spellDescriptor.damages;
		var speed = spellDescriptor.speed;
		var lifeTime = spellDescriptor.lifeTime;
		var self = Bullet(parent, name, aimGoalPoint, damages, speed, lifeTime);
        if(spellDescriptor.range)
        {
            self.range = spellDescriptor.range;
        }

        if(spellDescriptor.spellName === 'scurge')
        {
            self.x = parent.x;
            self.y = parent.y;
            //console.log('spell -> '+spellDescriptor.spellName+' : '+parent.x+':'+parent.y);
        }
        if(spellDescriptor.range)
        {
            self.range = spellDescriptor.range;

        }
	}
	else if (type === "noBullet") {
        if(name === "blink")
        {
            parent.x = aimGoalPoint.x;
            parent.y = aimGoalPoint.y;

        }
	}

	return self;
};
*/