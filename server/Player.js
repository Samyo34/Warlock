/**
 * Created by sambr on 24/09/2016.
 */



var Player = function(id){
	var self = Entity();
	self.id = id;
	self.number = "" + Math.floor(10 * Math.random());

    self.time =0;

	self.rotation = 0;
	self.angularVelocity = 0;
    self.isOrientationGood = false;
	
	self.goalDest = {
        x:self.x,
        y:self.y
    };

    self.isDead = false;

    self.hpMax = 200;
    self.hp = 200;

    self.SPEED = 2;

    self.friction = 1;
    self.currentSpeed = 0;
    self.isActive = true;

    self.spellsToCast = [];
    self.enemySpellActionVelocity = {
        x:0,
        y:0
    };

    self.actionTime = 0;// time when the spell action is over
    self.ratioSpeed = 1;
    self.actionDuration = 0;// duration of the spell action

	self.targetVisible = false;
	self.targetType = '';
    self.Spell = [];
	self.isShooting = false;
	self.aimGoalPoint = {
		x:self.x,
		y:self.y
	};

	self.mouseAngle = 0;

	var super_update = self.update;
	self.update = function(){
        self.updateFriction();
	    self.updatePosition();

        super_update();

		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
	};

	self.shootBullet = function(angle){
		var b = Bullet(self.id,angle);
		b.x = self.x;
		b.y = self.y;
	};
	
	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,	
			rotation:self.rotation,
			hp:self.hp,
			hpMax:self.hpMax,
			score:self.score,
			targetVisible:self.targetVisible,
			targetType:self.targetType,
		};		
	};
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			rotation:self.rotation,
			hp:self.hp,
            hpMax:self.hpMax,
			score:self.score,
			targetVisible:self.targetVisible,
			targetType:self.targetType,
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
		var spellDescriptor;

		if(name == "fireball")
		{
			spellDescriptor = {spellName:"fireball", spellType:"bullet", x: aimGoalPoint.x, y: aimGoalPoint.y, damages: 10};
			self.spellsToCast.push(spellDescriptor);
		}
		else if(name == "blink")
		{
			spellDescriptor = {spellName:"blink", spellType:"noBullet", xx: xx, yy: yy, x:x, y:y};
			self.spellsToCast.push(spellDescriptor);
		}
	};

	// then, when the wizard have the right orientation we cast it
	self.castSpell = function() {
		if(self.spellsToCast.length > 0)
		{
			var s = Spell(self, self.spellsToCast[0]);
			self.spellsToCast.shift();
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
            self.health -= 0.5;
        }
        else
        {
            self.friction = 1;
        }
    };

	self.updatePosition = function() {
		if (self.isShooting) // we turn the wizard toward the aimGoalPoint
		{
			//this.body.velocity.setTo(0, 0);
			self.spdX = 0;
			self.spdY = 0;
			self.currentSpeed = 0;

			if(self.isOrientationGood)
			{
				self.castSpell();
			}

			//================ Update rotation ================
			// we compute the desiredAngle towards the clicked point (in radians)
			self.angleDesired = Math.atan2(self.aimGoalPoint.y - self.y, self.aimGoalPoint.x - self.x);

			// we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
			var error = self.angleDesired - self.rotation;

			// If the error is small enough, we set the angular velocity to zero
			console.log("error : " +  Math.abs(error))
			if (Math.abs(error)%3.14 <= 0.1)
			{
				self.angularVelocity = 0;
				self.isOrientationGood = true;
			}
			else
			{
				error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
				self.angularVelocity = 150 * error; // we multiply the error by a gain K in order to converge faster
				self.rotation += self.angularVelocity/1000; // Why /1000 ?
			}
		}
		else {
			if(Math.abs(self.x - self.goalDest.x) <= 8 && Math.abs(self.y - self.goalDest.y) <= 8 ) {
				self.spdX = 0;
				self.spdY = 0;
				self.currentSpeed = 0;
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
				//console.log(self.id+" : currentSpeed: " + self.currentSpeed + ' '+ self.enemySpellActionVelocity.x);
				self.spdX = self.friction * self.currentSpeed * Math.cos(self.rotation) + self.enemySpellActionVelocity.x;
				self.spdY = self.friction * self.currentSpeed * Math.sin(self.rotation) + self.enemySpellActionVelocity.y;
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

					self.angularVelocity = 150 * error; // we multiply the error by a gain K in order to converge faster
				}
			}

			self.x += self.spdX;
			self.y += self.spdY;

			self.rotation += self.angularVelocity/1000; // Why /1000 ?
		}
		
	};
	
	Player.list[id] = self;
	
	initPack.player.push(self.getInitPack());
	
	return self;
};

Player.list = {};

Player.onConnect = function(socket){
	console.log("Player connected.");
	
	var player = Player(socket.id);
	
	socket.on('keyPress',function(data){
		if(data.inputId === 'A') {
			player.targetVisible = data.state;
			player.targetType = 'A';
			console.log("A")
		}
		else if(data.inputId === 'Z') {
			player.targetVisible = data.state;
			player.targetType = 'Z';
			console.log("Z")
		}
		else if(data.inputId === 'E') {
			player.targetVisible = data.state;
			player.targetType = 'E';
			console.log("E")
		}
		else if(data.inputId === 'R') {
			player.targetVisible = data.state;
			player.targetType = 'R';
			console.log("R")
		}
		else if(data.inputId === 'mouseAngle') {
			player.mouseAngle = data.state;
		}
	});
	
	socket.on('mouseRightClick',function(data){
		player.isOrientationGood = false;
        player.setGoalDest(data.x,data.y);
        player.currentSpeed = player.SPEED;
		console.log("Right Click");
	});

	socket.on('mouseLeftClick',function(data){
		player.isOrientationGood = false;
		if(player.targetVisible === true)
		{
			player.isShooting = true;
			player.setAimGoal(data.x,data.y);
			player.prepareSpell("fireball", player.aimGoalPoint);//, wizard[0].x, wizard[0].y, game.input.x, game.input.y);
			player.targetVisible = false;
		}
		console.log("Left Click");
	});
	
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
		bullet:Bullet.getAllInitPack()
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
	removePack.player.push(socket.id);
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

/*if(game.input.mouse.button === Phaser.Mouse.RIGHT_BUTTON)
{
	console.log("Right click")
	goalDestination = new Phaser.Point(game.input.x, game.input.y);
	wizard[0].goalDest = goalDestination;
	wizard[0].currentSpeed = wizard[0].SPEED;
}

if(target.visible && game.input.mouse.button === Phaser.Mouse.LEFT_BUTTON)
{
	console.log("Left click")
	wizard[0].isShooting = true;
	wizard[0].aimGoalPoint = new Phaser.Point(game.input.x, game.input.y);
	wizard[0].prepareSpell("blink", wizard[0].x, wizard[0].y, game.input.x, game.input.y);
	target.visible = false;
}*/