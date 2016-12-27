"use strict";
var Player = require('./Player.js');
var Spells = require('./Spells.js');
var globale = require('./globale.js');

(function(){
	class Room {
	constructor(nbPlayerMax, type, map){
		this.name = 'Room';
		this.nbPlayerMax = nbPlayerMax;
		this.nbPlayer = 0;
		this.id = Math.random();
		this.type = type;// deathmatch, ...

		this.hasToBeRemoved = false;

		this.players = [];
		this.bullets = [];

		this.nbRound = 3;
		this.currentRound = 0;

		this.map = map;
		this.mapCenterX = map.width/2;
		this.mapCenterY = map.height/2;

		this.initPack = {player:[],bullet:[]};
		this.removePack = {player:[],bullet:[]};
		this.endCoolDown = {};

		this.gameover = false;
	}

	getAllPlayersInitPack()
	{
		var players = [];
		for(var i = 0; i<this.players.length;i++)
		{
			players.push(this.players[i].getInitPack());
		}
		return players;
	}

	getAllBulletsInitPack()
	{
		var bullets = []
			for(var i = 0; i<this.bullets.length;i++)
		{
			bullets.push(this.bullet[i].getInitPack());
		}

		return bullets;
	}

	update()
	{
		/*if(this.currentRound === 0)
		{
			this.startNextRound();
		}*/
		if(this.hasToBeRemoved)
		{
			return 0;
		}
		if(this.players.length !== 0)
		{
			if(this.gameover === false) {
				var bufferPlayers = this.updatePlayers();
				var bufferBullets = this.updateBullets();
				var packBuffer = new ArrayBuffer((bufferPlayers.byteLength+bufferBullets.byteLength));
				//console.log('update '+bufferBullets.byteLength);
				var viewPackBuffer = new Int32Array(packBuffer);
				//console.log(bufferPlayers.byteLength+' '+bufferBullets.byteLength+' '+packBuffer.byteLength+' '+viewPackBuffer.length*4);
				viewPackBuffer.set(new Int32Array(bufferPlayers),0);
				if(bufferBullets.byteLength > 0)
					viewPackBuffer.set(new Int32Array(bufferBullets),bufferPlayers.byteLength/4);
				
				var nbDeadPlayer = 0;

				for(var i = 0; i < this.players.length; i++){
					var socket = globale.SOCKET_LIST[this.players[i].id];

					if(this.initPack.player[0] || this.initPack.bullet[0])
					{
						socket.emit('init',this.initPack);
					}
					else
					{
						socket.emit('update',packBuffer);
					}



					if(this.removePack.bullet.length>0 || this.removePack.player.length>0)
					{
						socket.emit('remove',this.removePack);
					}

					if(this.players[i].isDead)
					{
						nbDeadPlayer++;
					}
				}

				//console.log('nb players : '+nbPlayer);
				if(this.initPack.player.length > 0 || this.initPack.bullet.length > 0)
				{
					this.initPack.player = [];
					this.initPack.bullet = [];			
				}

				if(this.removePack.player.length > 0 || this.removePack.bullet.length > 0)
				{
					this.removePack.player = [];
					this.removePack.bullet = [];
				}

				if(nbDeadPlayer >= this.players.length-1 && this.players.length > 1)
				{
					console.log(nbDeadPlayer+':'+this.players.length+ ' | '+this.currentRound +':'+this.nbRound);
					// TODO: SPELL CHOICE + RESTART
					this.startNextRound();

				}
				
			}
			return 1;
		}


	}

	updatePlayers()
	{
	    var sizeBufferPlayer = 4*12;
	    var sizeBuffer = (sizeBufferPlayer*this.players.length+4);
	    var arrayBufferAllPlayer = new ArrayBuffer(sizeBuffer);
	    var viewArrayBufferAllPlayer = new Int32Array(arrayBufferAllPlayer);
	    viewArrayBufferAllPlayer[0]=parseInt(this.players.length);// number of player write on the first byte
	    var indexPlayer = 0;

	    for(var i = 0; i < this.players.length; i++)
	    {
	    	var player =  this.players[i];
	        player.update();
	     	var updatePack = player.getUpdatePack();
	    	for (var j = 0;j<updatePack.length;j++)
	     	{
	     		viewArrayBufferAllPlayer[(indexPlayer*updatePack.length)+j+1]=updatePack[j];
	     	}
	     	indexPlayer++;
	    }
	    //console.log('bullets '+arrayBufferAllBulletManagerbyteLength);
	    return arrayBufferAllPlayer;
	}

	addPlayer(player)
	{
		console.log("Add player " + player.id + " to room " + this.id)
		player.room = this;
		var socket = globale.SOCKET_LIST[player.id];
		socket.emit("gameStarted", true);

		if(this.players.length < this.nbPlayerMax)
		{
			console.log("Player connected " + player.id);

			//var player = new Player(socket.id, this, socket);
			this.players.push(player);
		
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
				selfId:parseInt(socket.id*100000000),
				player:this.getAllPlayersInitPack(),
				bullet:this.getAllBulletsInitPack()
			});

			for(var i = 0; i < this.players.length; i++)
			{
				if(socket.id !== this.players[i].id)
				{
					var socket = globale.SOCKET_LIST[this.players[i].id];
					socket.emit('init', { 	player:this.getAllPlayersInitPack(),
											bullet:this.getAllBulletsInitPack() });
				}
			}

			this.nbPlayer +=1;
			this.updateInfoRoom();
			return 1;
		}
		else // room full
		{
			return 0;
		}
	}

	removePlayer(socket)
	{
		for(var i = 0;i < this.players.length;i++)
		{
			if(this.players[i].id === socket.id)
			{
				delete this.players[i];
				this.players.splice(i,1);
				this.removePack.player.push({id:parseInt(socket.id*100000000)});

				if(this.players.length === 0)
					this.hasToBeRemoved = true;

				this.nbPlayer -=1;
				this.updateInfoRoom();
				return;
			}
		}
	}

	updateBullets()
	{
	    var sizeBufferBullet = 4*7;
	    var sizeBuffer = (sizeBufferBullet*this.bullets.length);
	    var arrayBufferAllBullet = new ArrayBuffer(sizeBuffer);
	    var viewArrayBufferAllBullet = new Int32Array(arrayBufferAllBullet);
	    var indexBullet = 0;

	    for(var i = 0; i < this.bullets.length;i++)
	    {
	        var bullet =  this.bullets[i];
	        bullet.update();
	        if(bullet.toRemove)
	        {
	            this.removePack.bullet.push({id:parseInt(bullet.id*100000000)});
	            this.removeBullet(bullet);
	        }
	        else
	        {
	            var updatePack = bullet.getUpdatePack();
	            for (var j = 0;j<updatePack.length;j++)
	            {
	                viewArrayBufferAllBullet[(indexBullet*updatePack.length)+j]=updatePack[j];
	            }
	            indexBullet++;
	        }



	    }
	    //console.log('bullets '+arrayBufferAllBulletManagerbyteLength);
	    return arrayBufferAllBullet;
	}

	addBullet(bullet)
	{
		this.bullets.push(bullet);
	}

	removeBullet(bullet)
	{
		for (var i = 0; i < this.bullets.length; i++) {
			if (this.bullets[i].id === bullet.id)
			{
				delete this.bullets[i];
				this.bullets.splice(i,1);
			} 
		}
	}

	startNextRound()
	{
		if(this.currentRound <= this.nbRound)
		{
			console.log("start Round")
			var positions = this.getPositions();
			for(var i = 0; i<this.players.length;i++)
			{
				var p = this.players[i];
				p.x = positions[i][0];
				p.y = positions[i][1];
				p.initPlayer();
			}
			this.currentRound++;

			this.updateInfoRoom();
		}
		else
		{
			console.log('Game Over !');
			var debug = 'score : ';
			for(var i = 0;i<this.players.length;i++)
			{
				debug+=this.players[i].id+ ':'+this.players[i].score +'|';
			}
			//console.log(debug);
			this.gameover = true;
		}
	}

	getPositions()
	{
		var positions = [];
		var divedNumber = 360/this.players.length;
		var distFromCenter = 30;//px
		for(var i =0; i<this.players.length;i++)
		{
			var p = this.players[i];
			var xy = [this.mapCenterX+distFromCenter*Math.cos(divedNumber*i),this.mapCenterY+distFromCenter*Math.sin(divedNumber*i)]
			positions.push(xy);
		}

		return positions;
	}

	updateInfoRoom()
	{
		for(var i = 0; i < this.players.length; i++)
		{
			var player =  this.players[i];
			var socket = globale.SOCKET_LIST[player.id];
			console.log("UPDATE INFOS")
			socket.emit('infoRoom', { 	nbPlayer: this.nbPlayer,
										nbPlayerMax: this.nbPlayerMax,
										round: this.currentRound,
										roundMax: this.nbRound,
			});
		}
	}

};

module.exports = Room;

})();







