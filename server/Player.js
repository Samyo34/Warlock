/**
 * Created by sambr on 24/09/2016.
 */
 
var Player = function(id){
	var self = Entity();
	self.id = id;
	self.number = "" + Math.floor(10 * Math.random());
	
	self.rotation = 0;
	self.angularVelocity = 0;
    self.isOrientationGood = true;
	
	self.goalDest = {
        x:self.x,
        y:self.y
    };

    self.isDead = false;

    self.fullHealth = 200;
    self.health = 200;

    self.SPEED = 2;

    self.friction = 1;
    self.currentSpeed = 0;
    self.isActive = true;

    self.spellsToCast = [];
    self.enemySpellActionVelocity = {
        x:0,
        y:0
    };

    self.actionTime = 0;
    self.ratioSpeed = 1;
    self.actionDuration = 0;

	//  this.healthBar = new HealthBar(game, {x: x, y: y-25, width: 40, height : 5});

    self.Spell = [];
   //this.Spell.push(new Spell.FireBall(game, xSpellIndic, ySpellIndic));
   
	self.mouseAngle = 0;
	
	var super_update = self.update;
	self.update = function(){
		self.updatePosition();
		super_update();
		//console.log(self.x + " " + self.y)
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
	}

	self.shootBullet = function(angle){
		var b = Bullet(self.id,angle);
		b.x = self.x;
		b.y = self.y;
	}
	
	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,	
			rotation:self.rotation,
			hp:self.hp,
			hpMax:self.hpMax,
			score:self.score,
		};		
	}
	
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			rotation:self.rotation,
			hp:self.hp,
			score:self.score,
		}	
	}
	
	self.setGoalDest = function(destX,destY){
		self.goalDest.x = destX;
		self.goalDest.y = destY;
	}
	
	self.updatePosition = function() {
		if(Math.abs(self.x - self.goalDest.x) <= 8 && Math.abs(self.y - self.goalDest.y) <= 8 ) {
			self.spdX=0;
			self.spdY=0;
			self.currentSpeed =0;
		}
		else {
			//console.log("currentSpeed: " + self.currentSpeed)
			self.spdX = self.friction * self.currentSpeed * Math.cos(self.rotation) + self.enemySpellActionVelocity.x;
			self.spdY = self.friction * self.currentSpeed * Math.sin(self.rotation) + self.enemySpellActionVelocity.y;
		}

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

			self.angularVelocity = 150*error; // we multiply the error by a gain K in order to converge faster
		}

	/*
		angleDesired = Math.atan2(self.goalDest.y - self.y, self.goalDest.x - self.x);

		// we compute the gap in radians (self.rotation is in radians and self.angle in degrees)
		var error = angleDesired - self.rotation;

		// If the error is small enough, we set the angular velocity to zero
		if (Math.abs(error) <= 0.001)
		{
			self.body.angularVelocity = 0;
			self.isOrientationGood = true;
		}
		else
		{
			error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
			self.body.angularVelocity = K * error; // we multiply the error by a gain K in order to converge faster
		}*/

		self.x += self.spdX;
		self.y += self.spdY;
		//console.log("x: " + self.x + " y: " + self.y)
	   // self.rotation = self.rotation;
		
		
		self.rotation += self.angularVelocity/1000; // Why /1000 ?
		
	}
	
	Player.list[id] = self;
	
	initPack.player.push(self.getInitPack());
	
	return self;
}

Player.list = {};

Player.onConnect = function(socket){
	console.log("Player connected.")
	
	var player = Player(socket.id);
	
	socket.on('keyPress',function(data){
		if(data.inputId === 'left') {
			player.pressingLeft = data.state;
			console.log("left")
		}
		else if(data.inputId === 'right') {
			player.pressingRight = data.state;
			console.log("right")
		}
		else if(data.inputId === 'up') {
			player.pressingUp = data.state;
			console.log("up")
		}
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
		else if(data.inputId === 'attack')
			player.pressingAttack = data.state;
		else if(data.inputId === 'mouseAngle')
			player.mouseAngle = data.state;
	});
	
	socket.on('mouseClick',function(data){
        player.setGoalDest(data.x,data.y);
        player.currentSpeed = player.SPEED;
		console.log("Click");
    });
	
	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
		bullet:Bullet.getAllInitPack()
	})
}

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}

Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}

Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());		
	}
	return pack;
}