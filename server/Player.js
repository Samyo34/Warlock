/**
 * Created by sambr on 24/09/2016.
 */


var Player = function(id, room,socket){
	//var this = Entity();
	this.id = id;
	this.x = 250;
	this.y = 250;
	this.spdX = 0;
	this.spdY = 0;
	this.room = room;

	//this.socket = socket;

	//this.number = "" + Math.floor(10 * Math.random());
    this.size = 32; // car le sprite des wizard fait 32x32 pix

   this.time =0;

	this.rotation = 0;
	this.angularVelocity = 0;
	this.isOrientationGood = false;
	this.isPositionGood = false;

	this.goalDest = {
        x:this.x,
        y:this.y
    };

    this.isDead = false;

    this.hpMax = 200;
    this.hp = 200;

    this.SPEED = 4;

    this.friction = 1;
    this.currentSpeed = 0;
    this.isActive = true;

    this.spellList = []; // array of spells available for the player
    this.spellList.push(new fireballCard(this));
    this.spellList.push(new blinkCard(this));
    this.spellList.push(new lightningCard(this));
    this.spellList.push(new scurgeCard(this));

    //this.spellsParams = SpellsParam();
    this.spellsToCast = [];

	// velocity caused by the enemy spells. This velocity is added to the player one
	this.enemySpellActionVelocity = {
        x:0,
        y:0
    };

	this.actionTime = 0; // time when the spell action is over
   this.ratioSpeed = 1;
   this.actionDuration = 0; // duration of the spell action

   this.targetVisible = false; // Is the player pressing a key for a spell
	this.targetType = '';

	this.Spell = [];
	this.isShooting = false;
	this.isMoving = false;
	this.aimGoalPoint = {
		x:this.x,
		y:this.y
	};

	this.mouseAngle = 0;
	this.room.players.push(this);
	//this.room.initPack.player.push(this.getInitPack());
	
	//return this;
};

Player.prototype.initPlayer = function()
{
	this.spdX = 0;
	this.spdY = 0;

	this.isDead = false;

	this.hp = this.hpMax;
	this.time =0;

	this.score = 0;

	this.rotation = 0;
	this.angularVelocity = 0;
	this.isOrientationGood = false;
	this.isPositionGood = false;

	this.spellsToCast = [];
	this.enemySpellActionVelocity = {
        x:0,
        y:0
    };

   this.isShooting = false;
	this.isMoving = false;
	this.aimGoalPoint = {
		x:this.x,
		y:this.y
	};

	this.mouseAngle = 0;

	this.room.initPack.player.push(this.getInitPack());
}

Player.prototype.getSpellByKey = function(key) {
	for(var i in this.spellList)
	{
		if (this.spellList[i].key === key)
		{
			return this.spellList[i];
		}
	}
	return null;
};

Player.prototype.getSpellByName = function(name) {
	for(var i in this.spellList)
	{
		if (this.spellList[i].name === name)
		{
			return this.spellList[i];
		}
	}
	return null;
};



//var super_update = this.update;
Player.prototype.update = function(){
	this.updateFriction();
	this.updatePosition();
	this.updateCooldowns();

     //super_update();

	// Check if player is dead
	if(this.hp <= 0)
	{
		this.isDead = true;
	}
};
	
Player.prototype.getInitPack = function(){
	return {
		id: parseInt(this.id*100000000),
		x: this.x,
		y: this.y,
		rotation: this.rotation,
		hp: this.hp,
		hpMax: this.hpMax,
		score: this.score,
		targetVisible: this.targetVisible,
		targetType: this.targetType,
		isShooting: this.isShooting,
		isMoving: this.isMoving,
      sizePlayer: this.size,
		isDead: this.isDead,
	};		
};

Player.prototype.getCooldownsPack = function(){
	var listCd = []; // We will store in this array all the cooldown progress
	// TODO: we could store only the cd on progress, here we store all the cooldowns even when they are 0
	for (var i in this.spellList)
	{
		listCd.push( {	spellName: this.spellList[i].name,
						cdProgress: this.spellList[i].cdProgress} );
	}
	return listCd;
};

Player.prototype.getUpdatePack = function(){
	//console.log('size : ' + ab.byteLength);
	var valuesArray = new Int32Array(13);
	valuesArray[0] = parseInt(this.id*100000000);
	valuesArray[1] = parseInt(this.x);
	valuesArray[2] = parseInt(this.y);
	valuesArray[3] = parseInt(this.rotation*100000000);
	valuesArray[4] = parseInt(this.hp);
	valuesArray[5] = parseInt(this.hpMax);
	if(this.targetVisible)
	{
		valuesArray[6] = parseInt(1);
	}
	else
	{
		valuesArray[6] = parseInt(0);
	}

	if(this.targetType)
	{
		valuesArray[7] = parseInt(1);
	}
	else
	{
		valuesArray[7] = parseInt(0);
	}
	
	if(this.isDead)
	{
		valuesArray[8] = parseInt(1);
	}
	else
	{
		valuesArray[8] = parseInt(0);
	}

	if(this.isShooting)
	{
		valuesArray[9] = parseInt(1);
	}
	else
	{
		valuesArray[9] = parseInt(0);
	}

	if(this.isMoving)
	{
		valuesArray[10] = parseInt(1);
	}
	else
	{
		valuesArray[10] = parseInt(0);
	}
	valuesArray[11] = parseInt(this.size);
	valuesArray[12] = parseInt(10);
	return valuesArray;
/*		return ''+this.id + ';' +
	parseInt(this.x)+ ';' +
	parseInt(this.y)+ ';' +
	parseInt(this.rotation*100000)+ ';' +
	parseInt(this.hp)+';'+
	parseInt(this.hpMax)+';'+
	this.targetVisible +';'+
	this.targetType+';'+
	this.isDead+';'+
	this.isShooting+';'+
	this.isMoving+';'+
	parseInt(this.size)+';'+
	this.getCooldownsPack()+'';*/
	/*return {
		id: this.id,
		x: Math.floor(this.x),
		y: Math.floor(this.y),
		rotation: parseInt(this.rotation*100000),
		hp: Math.floor(this.hp),
		hpMax: Math.floor(this.hpMax),
		score: Math.floor(this.score),
		targetVisible: this.targetVisible,
		targetType: this.targetType,
		isDead: this.isDead,
		isShooting: this.isShooting,
		isMoving: this.isMoving,
      sizePlayer: Math.floor(this.size),
		spellCooldowns: this.getCooldownsPack()
	}*/
};
	
Player.prototype.setAimGoal = function(destX, destY){
	this.aimGoalPoint.x = destX;
	this.aimGoalPoint.y = destY;
};

Player.prototype.setGoalDest = function(destX, destY){
	this.goalDest.x = destX;
	this.goalDest.y = destY;
};

Player.prototype.prepareSpell = function(name, aimGoalPoint) {
     //console.log('prepare spell : '+name + ','+this.spellCooldowns[name]["current"]);
     //console.log(this.getSpellByName(name).cdCurrent);
	if(this.getSpellByName(name).cdCurrent != 0)
	{
		return;
	}
     console.log('prepare spell : ' + name);

	this.aimGoalPoint.x = aimGoalPoint.x;
	this.aimGoalPoint.y = aimGoalPoint.y;
	this.spellsToCast.push(this.getSpellByName(name));

	/*if(name == "fireball")
replaceAll('data name')            this.aimGoalPoint.x = aimGoalPoint.x;
         this.aimGoalPoint.y = aimGoalPoint.y;
         this.spellsToCast.push(this.spellList[0]);
	}
	else if(name == "blink")
	{
         this.aimGoalPoint.x = aimGoalPoint.x;
         this.aimGoalPoint.y = aimGoalPoint.y;
         this.spellsToCast.push(this.spellList[1]);
	}
	else if(name == "lightning")
	{
         this.aimGoalPoint.x = aimGoalPoint.x;
         this.aimGoalPoint.y = aimGoalPoint.y;
         this.spellsToCast.push(this.spellList[2]);
	}
	else if (name == "scurge")
     {
         //console.log("scurge");
         spellDescriptor = { spellName:"scurge",
                             spellType:"bullet",
                             x:this.x,
                             y:this.y,
                             damages:10,
                             lifeTime:10,
                             cooldown:5000,
                             range: this.size*4};
         this.linkedSpells.push(spellDescriptor);
         this.spellsToCast.push(this.spellList[3]/*spellDescriptor);
     }
         //this.linkedSpells.push(spellDescriptor);
         //this.spellsToCast.push(this.spellList[3]);
     }
     */
};

// then, when the wizard have the right orientation we cast it
Player.prototype.castSpell = function() {
	if(this.spellsToCast.length > 0)
	{
		this.spellsToCast[0].cast(this.aimGoalPoint);
		this.spellsToCast.shift();
		/*var s = Spell(this, this.spellsToCast[0]);
		var name = this.spellsToCast[0].spellName;
		this.spellCooldowns[name].current = this.spellCooldowns[name].total;
		this.spellsToCast.shift();*/
         /*if(this.linkedSpells[0])
         {
            this.linkedSpells.shift();
         }*/
	}
	else
	{
		this.isShooting = false;
	}
};

Player.prototype.updateFriction = function() {
     // Check if the player is on the lava:
     var line = Math.floor(this.x / TILE_WIDTH);
     var column = Math.floor(this.y / TILE_HEIGHT);

     var indexInMapArray = column*25 + line;
     if (map_array[indexInMapArray] == LAVA) // player on lava
     {
         this.friction = 0.5;
         this.hp -= 2;
     }
     else
     {
         this.friction = 1;
     }
 };

Player.prototype.updatePosition = function() {
	if(this.spellsToCast[0])
	{
         //console.log('spell to cast : '+this.spellsToCast[0].spellName);
/*            if(this.spellsToCast[0].spellType === "noBullet")
{*/
	console.log('dist : '+Math.sqrt(((this.aimGoalPoint.x-this.x)*(this.aimGoalPoint.x-this.x))+
		((this.aimGoalPoint.y-this.y)*(this.aimGoalPoint.y-this.y))));
	if(this.spellsToCast[0].rangeAction === null || Math.sqrt(((this.aimGoalPoint.x-this.x)*(this.aimGoalPoint.x-this.x))+
		((this.aimGoalPoint.y-this.y)*(this.aimGoalPoint.y-this.y))) <=
		this.spellsToCast[0].rangeAction)
	{
		this.goalDest.x = this.x;
		this.goalDest.y = this.y;
		this.currentSpeed = 0;
		this.isPositionGood = true;
		this.isOrientationGood = true;
		this.isShooting = true;
	}
	else
	{
		this.goalDest.x = this.aimGoalPoint.x;
		this.goalDest.y = this.aimGoalPoint.y;
		this.currentSpeed = this.SPEED;
		this.isShooting = false;
		this.isPositionGood = false;
	}
}

	if (this.isShooting) // we turn the wizard toward the aimGoalPoint
	{
	    //console.log('ishooting : '+this.isOrientationGood +' '+ this.isPositionGood );
		//this.body.velocity.setTo(0, 0);
		this.spdX = 0;
		this.spdY = 0;
		this.currentSpeed = 0;

		if(this.isOrientationGood && this.isPositionGood)
		{
			this.castSpell();
		}

		//================ Update rotation ================
		// we compute the desiredAngle towards the clicked point (in radians)
		this.angleDesired = Math.atan2(this.aimGoalPoint.y - this.y, this.aimGoalPoint.x - this.x);

		// we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
		var error = this.angleDesired - this.rotation;

		// If the error is small enough, we set the angular velocity to zero
		//console.log("error : " +  Math.abs(error))
		if (Math.abs(error)%3.14 <= 0.1)
		{
			this.angularVelocity = 0;
			this.isOrientationGood = true;
		}
		else
		{
			error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]
			this.angularVelocity = 250 * error; // we multiply the error by a gain K in order to converge faster
			this.rotation += this.angularVelocity/1000; // Why /1000 ?
		}
	}
	else {
		if(Math.abs(this.x - this.goalDest.x) <= 8 && Math.abs(this.y - this.goalDest.y) <= 8 ) {
			this.spdX = 0;
			this.spdY = 0;
			this.currentSpeed = 0;
			this.isMoving = false;
           /*  this.angularVelocity = 0;
           this.isOrientationGood = true;*/
        }
        else
        {
        	this.isMoving = true;
        }
		//else {
			var d = new Date();
			if(d.getTime() < this.actionTime)
			{

				var cd = this.actionTime - d.getTime();
			//console.log('spell action : '+cd + ' '+ this.actionTime + ' '+this.time.getTime());
			//console.log('action time '+this.actionTime + ' '+time.getTime());
			var ratioSpeed =  (((100*cd)/this.actionDuration) /100);
			this.enemySpellActionVelocity.x = this.enemySpellActionVelocity.x*ratioSpeed;
			this.enemySpellActionVelocity.y = this.enemySpellActionVelocity.y*ratioSpeed;
		}
		else
		{
			this.enemySpellActionVelocity.x = 0;
			this.enemySpellActionVelocity.y = 0;
		}
		angleDesired = Math.atan2(this.goalDest.y - this.y, this.goalDest.x - this.x);
		//console.log("AngleDesired: " + angleDesired);

		// we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
		var error = angleDesired - this.rotation;
		var tempRot = this.rotation;
        // console.log('angle : '+(error*180/Math.PI));
        if(Math.abs((error*180/Math.PI))>10)
        {
        	tempRot = angleDesired;
        }

		//console.log(this.id+" : currentSpeed: " + Math.cos(this.rotation) + ' '+ Math.sin(this.rotation));
		this.spdX = this.friction * this.currentSpeed * Math.cos(tempRot) + this.enemySpellActionVelocity.x;
		this.spdY = this.friction * this.currentSpeed * Math.sin(tempRot) + this.enemySpellActionVelocity.y;
		//}

		if(this.isOrientationGood != true) {
			angleDesired = Math.atan2(this.goalDest.y - this.y, this.goalDest.x - this.x);
			//console.log("AngleDesired: " + angleDesired);

			// we compute the gap in radians (this.rotation is in radians and this.angle in degrees)
			var error = angleDesired - this.rotation;
			//console.log("rotation: " + this.rotation)
			//console.log("angleDesired: " + angleDesired)

			//console.log("error :" + error)

			// If the error is small enough, we set the angular velocity to zero
			if (Math.abs(error) <= 0.001) {
				this.angularVelocity = 0;
				this.isOrientationGood = true;
			}
			else {
				error = Math.atan2(Math.sin(error), Math.cos(error)); // in order to be sure that the error is in the range [-pi/2, pi/2]

				this.angularVelocity = 250 * error; // we multiply the error by a gain K in order to converge faster
			}
		}

		this.x += this.spdX;
		this.y += this.spdY;

		this.rotation += this.angularVelocity/1000; // Why /1000 ?
		this.angularVelocity = 0;
	}
	
};

Player.prototype.updateCooldowns = function() {
	for (var i in this.spellList)
	{
		this.spellList[i].updateCooldown();
	}
};

var PlayerManager = function()
{
	this.PlayerList = {};
}


PlayerManager.onConnect = function(socket){
	console.log("Player connected " + socket.id);
	
	var player = new Player(socket.id);
	
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
				player.isShooting = 1;
				player.setAimGoal(data.x,data.y);
				player.prepareSpell(spell.name, player.aimGoalPoint);
				player.targetVisible = 0;
			}
		}
		console.log("Left Click");
	});
	
	socket.emit('init',{
		thisId:parseInt(socket.id*100000000),
		player:players.getAllInitPack(),
		bullet:bullets.getAllInitPack()
	})
};

PlayerManager.getAllInitPack = function(){
	var players = [];
	for(var i in this.PlayerList)
		players.push(this.PlayerList[i].getInitPack());
	return players;
};

PlayerManager.onDisconnect = function(socket){
	delete this.PlayerList[socket.id];
	removePack.player.push({id:parseInt(socket.id*100000000)});
};

PlayerManager.update = function(){
	var sizeBufferPlayer = 4*13;
	var sizeBuffer = (sizeBufferPlayer*Object.keys(this.PlayerList).length)+4;
	var arrayBufferAllPlayer = new ArrayBuffer(sizeBuffer);
	var viewArrayBufferAllPlayer = new Int32Array(arrayBufferAllPlayer);
	viewArrayBufferAllPlayer[0]=parseInt(Object.keys(this.PlayerList).length);// number of player on the first byte
	var indexPlayer = 0;
	for(var i in this.PlayerList)
	{
		var player = this.PlayerList[i];
		player.update();
		var updatePack = player.getUpdatePack();
		//console.log(updatePack);
		for (var j = 0;j<updatePack.length;j++)
		{
			viewArrayBufferAllPlayer[(indexPlayer*updatePack.length)+j+1]=updatePack[j];
		}
		indexPlayer++;
	}
	//console.log('player '+viewArrayBufferAllPlayer[12]);
	return arrayBufferAllPlayer;
/*	var pack = [];
	console.log(Object.keys(Player.list).length);
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());
	}
	return pack;*/
};

// push the array(int32array) into buffer at the index (index = 0 for first element, = 1 for second...)
// The arrays' size must match with the buffer size
PlayerManager.pushBuffer = function(buffer, array,index)
{

	console.log('pushBuffer '+buffer.length);
	//var viewArrayBuffer = new Int32Array(buffer);
	var sizePlayer = array.length;
	for (var i = 0;i<sizePlayer;i++)
	{
		buffer[(index*sizePlayer)+i+1]=array[i];
	}
	console.log('pushBuffer2 '+((index*sizePlayer)+1)+ ':'+buffer[(index*sizePlayer)+2]+' '+buffer[index*sizePlayer+3]);
};