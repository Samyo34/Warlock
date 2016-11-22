/**
 * Created by sambr on 24/09/2016.
 */


var Player = function(id){
	var self = Entity();
	self.id = id;
	self.number = "" + Math.floor(10 * Math.random());
    self.size = 32; // car le sprite des wizard fait 32x32 pix

   	self.time =0;

	self.rotation = 0;
	self.angularVelocity = 0;
	self.isOrientationGood = false;
	self.isPositionGood = false;

	self.goalDest = {
        x:self.x,
        y:self.y
    };

    self.isDead = false;

    self.hpMax = 200;
    self.hp = 200;

    self.SPEED = 4;

    self.friction = 1;
    self.currentSpeed = 0;
    self.isActive = true;

    self.spellList = []; // array of spells available for the player
    self.spellList.push(new fireballCard(self));
    self.spellList.push(new blinkCard(self));
    self.spellList.push(new lightningCard(self));
    self.spellList.push(new scurgeCard(self));

    //self.spellsParams = SpellsParam();
    self.spellsToCast = [];

	// velocity caused by the enemy spells. This velocity is added to the player one
	self.enemySpellActionVelocity = {
        x:0,
        y:0
    };

    self.linkedSpells = [];

	self.actionTime = 0; // time when the spell action is over
    self.ratioSpeed = 1;
    self.actionDuration = 0; // duration of the spell action

    self.getSpellByKey = function(key) {
		for(var i in self.spellList)
		{
			if (self.spellList[i].key === key)
			{
				return self.spellList[i];
			}
		}
		return null;
	};

	self.getSpellByName = function(name) {
		for(var i in self.spellList)
		{
			if (self.spellList[i].name === name)
			{
				return self.spellList[i];
			}
		}
		return null;
	};

	self.targetVisible = false; // Is the player pressing a key for a spell
	self.targetType = '';

	self.Spell = [];
	self.isShooting = false;
	self.isMoving = false;
	self.aimGoalPoint = {
		x:self.x,
		y:self.y
	};

	self.mouseAngle = 0;

	//var super_update = self.update;
	self.update = function(){
		self.updateFriction();
		self.updatePosition();
		self.updateCooldowns();

        //super_update();

		// Check if player is dead
		if(self.hp <= 0)
		{
			self.isDead = true;
		}
	};
	
	self.getInitPack = function(){
		return {
			id: self.id,
			x: self.x,
			y: self.y,
			rotation: self.rotation,
			hp: self.hp,
			hpMax: self.hpMax,
			score: self.score,
			targetVisible: self.targetVisible,
			targetType: self.targetType,
			isShooting: self.isShooting,
			isMoving: self.isMoving,
         	sizePlayer: self.size,
			isDead: self.isDead,
		};		
	};

	self.getCooldownsPack = function(){
		var listCd = []; // We will store in this array all the cooldown progress
		// TODO: we could store only the cd on progress, here we store all the cooldowns even when they are 0
		for (var i in self.spellList)
		{
			listCd.push( {	spellName: self.spellList[i].name,
							cdProgress: self.spellList[i].cdProgress} );
		}
		return listCd;
	};
	
	self.getUpdatePack = function(){
		return {
			id: self.id,
			x: self.x,
			y: self.y,
			rotation: self.rotation,
			hp: self.hp,
			hpMax: self.hpMax,
			score: self.score,
			targetVisible: self.targetVisible,
			targetType: self.targetType,
			isDead: self.isDead,
			isShooting: self.isShooting,
			isMoving: self.isMoving,
         	sizePlayer: self.size,
			spellCooldownsArray: self.getCooldownsPack()
		}
	};
	
	self.setAimGoal = function(destX, destY){
		self.aimGoalPoint.x = destX;
		self.aimGoalPoint.y = destY;
	};

	self.setGoalDest = function(destX, destY){
		self.goalDest.x = destX;
		self.goalDest.y = destY;
	};

	self.prepareSpell = function(name, aimGoalPoint) {
        console.log('prepare spell : ' + name);

		self.aimGoalPoint.x = aimGoalPoint.x;
		self.aimGoalPoint.y = aimGoalPoint.y;
		self.spellsToCast.push(self.getSpellByName(name));

		/*if(name == "fireball")
		{
            self.aimGoalPoint.x = aimGoalPoint.x;
            self.aimGoalPoint.y = aimGoalPoint.y;
            self.spellsToCast.push(self.spellList[0]);
		}
		else if(name == "blink")
		{
            self.aimGoalPoint.x = aimGoalPoint.x;
            self.aimGoalPoint.y = aimGoalPoint.y;
            self.spellsToCast.push(self.spellList[1]);
		}
		else if(name == "lightning")
		{
            self.aimGoalPoint.x = aimGoalPoint.x;
            self.aimGoalPoint.y = aimGoalPoint.y;
            self.spellsToCast.push(self.spellList[2]);
		}
		else if (name == "scurge")
        {
            //self.linkedSpells.push(spellDescriptor);
            self.spellsToCast.push(self.spellList[3]);
        }*/
	};

	// then, when the wizard have the right orientation we cast it
	self.castSpell = function() {
		if(self.spellsToCast.length > 0)
		{
			self.spellsToCast[0].cast(self.aimGoalPoint);
			self.spellsToCast.shift();
			/*var s = Spell(self, self.spellsToCast[0]);
			var name = self.spellsToCast[0].spellName;
			self.spellCooldowns[name].current = self.spellCooldowns[name].total;
			self.spellsToCast.shift();*/
            /*if(self.linkedSpells[0])
            {
               self.linkedSpells.shift();
            }*/
		}
		else
		{
			self.isShooting = false;
		}
	};

	self.updateFriction = function() {
        // Check if the player is on the lava:
        var line = Math.floor(self.x / TILE_WIDTH);
        var column = Math.floor(self.y / TILE_HEIGHT);

        var indexInMapArray = column*25 + line;
        if (map_array[indexInMapArray] == LAVA) // player on lava
        {
            self.friction = 0.5;
            self.hp -= 2;
        }
        else
        {
            self.friction = 1;
        }
    };

	self.updatePosition = function() {
	    if(self.linkedSpells[0])
	    {
            self.linkedSpells[0].x = self.x;
            self.linkedSpells[0].y = self.y;
       }
	    if(self.spellsToCast[0])
	    {
            //console.log('spell to cast : '+self.spellsToCast[0].spellName);
/*            if(self.spellsToCast[0].spellType === "noBullet")
            {*/
            	console.log('dist : '+Math.sqrt(((self.aimGoalPoint.x-self.x)*(self.aimGoalPoint.x-self.x))+
                        ((self.aimGoalPoint.y-self.y)*(self.aimGoalPoint.y-self.y))));
                if(self.spellsToCast[0].rangeAction === null || Math.sqrt(((self.aimGoalPoint.x-self.x)*(self.aimGoalPoint.x-self.x))+
                        ((self.aimGoalPoint.y-self.y)*(self.aimGoalPoint.y-self.y))) <=
                    self.spellsToCast[0].rangeAction)
                {
                    self.goalDest.x = self.x;
                    self.goalDest.y = self.y;
                    self.currentSpeed = 0;
                    self.isPositionGood = true;
                    self.isOrientationGood = true;
                    self.isShooting = true;
                }
                else
                {
                    self.goalDest.x = self.aimGoalPoint.x;
                    self.goalDest.y = self.aimGoalPoint.y;
                    self.currentSpeed = self.SPEED;
                    self.isShooting = false;
                    self.isPositionGood = false;
                }
/*
            }
            else if (self.spellsToCast[0].spellType === "bullet")
            {
                self.isPositionGood = true;
            }*/
       }

		if (self.isShooting) // we turn the wizard toward the aimGoalPoint
		{
		    //console.log('ishooting : '+self.isOrientationGood +' '+ self.isPositionGood );
			//this.body.velocity.setTo(0, 0);
            self.spdX = 0;
            self.spdY = 0;
            self.currentSpeed = 0;

			if(self.isOrientationGood && self.isPositionGood)
			{
				self.castSpell();
			}

			//================ Update rotation ================
			// we compute the desiredAngle towards the clicked point (in radians)
			self.angleDesired = Math.atan2(self.aimGoalPoint.y - self.y, self.aimGoalPoint.x - self.x);

			// we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
			var error = self.angleDesired - self.rotation;

			// If the error is small enough, we set the angular velocity to zero
			//console.log("error : " +  Math.abs(error))
			if (Math.abs(error)%3.14 <= 0.1)
			{
				self.angularVelocity = 0;
				self.isOrientationGood = true;
			}
			else
			{
				error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
				self.angularVelocity = 250 * error; // we multiply the error by a gain K in order to converge faster
				self.rotation += self.angularVelocity/1000; // Why /1000 ?
			}
		}
		else {
			if(Math.abs(self.x - self.goalDest.x) <= 8 && Math.abs(self.y - self.goalDest.y) <= 8 ) {
				self.spdX = 0;
				self.spdY = 0;
				self.currentSpeed = 0;
				self.isMoving = false;
              /*  self.angularVelocity = 0;
                self.isOrientationGood = true;*/
			}
			else
			{
				self.isMoving = true;
			}
			//else {
            var d = new Date();
			if(d.getTime() < self.actionTime)
			{

				var cd = self.actionTime - d.getTime();
				//console.log('spell action : '+cd + ' '+ self.actionTime + ' '+self.time.getTime());
				//console.log('action time '+self.actionTime + ' '+time.getTime());
				var ratioSpeed =  (((100*cd)/self.actionDuration) /100);
				self.enemySpellActionVelocity.x = self.enemySpellActionVelocity.x*ratioSpeed;
				self.enemySpellActionVelocity.y = self.enemySpellActionVelocity.y*ratioSpeed;
			}
			else
			{
				self.enemySpellActionVelocity.x = 0;
				self.enemySpellActionVelocity.y = 0;
			}
			angleDesired = Math.atan2(self.goalDest.y - self.y, self.goalDest.x - self.x);
			//console.log("AngleDesired: " + angleDesired);

			// we compute the gap in radians (self.rotation is in radians and self.angle in degrees)
			var error = angleDesired - self.rotation;
			var tempRot = self.rotation;
           // console.log('angle : '+(error*180/Math.PI));
			if(Math.abs((error*180/Math.PI))>10)
			{
				tempRot = angleDesired;
			}

			//console.log(self.id+" : currentSpeed: " + Math.cos(self.rotation) + ' '+ Math.sin(self.rotation));
			self.spdX = self.friction * self.currentSpeed * Math.cos(tempRot) + self.enemySpellActionVelocity.x;
			self.spdY = self.friction * self.currentSpeed * Math.sin(tempRot) + self.enemySpellActionVelocity.y;
			//}

			if(self.isOrientationGood != true) {
				angleDesired = Math.atan2(self.goalDest.y - self.y, self.goalDest.x - self.x);
				//console.log("AngleDesired: " + angleDesired);

				// we compute the gap in radians (self.rotation is in radians and self.angle in degrees)
				var error = angleDesired - self.rotation;
				//console.log("rotation: " + self.rotation)
				//console.log("angleDesired: " + angleDesired)

				//console.log("error :" + error)

				// If the error is small enough, we set the angular velocity to zero
				if (Math.abs(error) <= 0.001) {
					self.angularVelocity = 0;
					self.isOrientationGood = true;
				}
				else {
					error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]

					self.angularVelocity = 250 * error; // we multiply the error by a gain K in order to converge faster
				}
			}

			self.x += self.spdX;
			self.y += self.spdY;

			self.rotation += self.angularVelocity/1000; // Why /1000 ?
            self.angularVelocity = 0;
		}
		
	};

	self.updateCooldowns = function() {
		for (var i in self.spellList)
		{
			self.spellList[i].updateCooldown();
		}
	};
	
	Player.list[id] = self;
	
	initPack.player.push(self.getInitPack());
	
	return self;
};

Player.list = {};

Player.onConnect = function(socket){
	console.log("Player connected." + socket.id);
	
	var player = Player(socket.id);
	
	socket.on('keyPress',function(data){

		var spell = player.getSpellByKey(data.inputId);

		if(data.inputId === 'mouseAngle')
		{
			player.mouseAngle = data.state;
		}
		else if(spell.isClickNeeded)
		{
			player.targetVisible = data.state;
			player.targetType = data.inputId;
			console.log(data.inputId)
		}
		else
		{
			player.targetVisible = data.state;
			player.targetType = data.inputId;

            if (spell.cdCurrent === 0)
            {
            	player.isShooting = true;
            	player.setAimGoal(player.x,player.y);
            	player.prepareSpell(spell.name, player.aimGoalPoint);
            }
			console.log(data.inputId)
		}
	});
	
	socket.on('mouseRightClick',function(data){
		player.isOrientationGood = false;
        player.setGoalDest(data.x,data.y);
        player.currentSpeed = player.SPEED;
		//console.log("Right Click");
	});

	socket.on('mouseLeftClick',function(data){
		player.isOrientationGood = false;

		if(player.targetVisible === true)
		{
            var spell = player.getSpellByKey(player.targetType);
			if (spell.cdCurrent === 0)
			{
				player.isShooting = true;
				player.setAimGoal(data.x,data.y);
				player.prepareSpell(spell.name, player.aimGoalPoint);
				player.targetVisible = false;
			}
		}
		console.log("Left Click");
	});
	
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
		bullet:bullets.getAllInitPack()
	})
};

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
};

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push({id:socket.id});
};

Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());
	}
	return pack;
};

