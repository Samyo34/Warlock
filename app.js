var express = require('express');
var app = express();
var serv = require('http').Server(app);

//var profiler = require('v8-profiler');
var fs = require('fs');
console.log(__dirname+'/Server/Player.js');

/*eval(fs.readFileSync(__dirname+'/Server/Room.js')+'');
eval(fs.readFileSync(__dirname+'/Server/Player.js')+'');
eval(fs.readFileSync(__dirname+'/Server/Bullet.js')+'');
eval(fs.readFileSync(__dirname+'/Server/SpellsCards.js')+'');
eval(fs.readFileSync(__dirname+'/Server/Spells.js')+'');*/

var Room = require('./Server/Room.js');
var PoolOfRoom = require('./Server/PoolOfRoom.js');
var globale = require('./Server/globale.js');
var Game = require('./Server/Game.js');

app.set('port', (process.env.PORT || 5000));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.get( '/*' , function( req, res, next ) {
    var file = req.params[0];
    res.sendFile( __dirname + '/' + file );
});

//app.use('/client',express.static(__dirname + '/client'));

serv.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
console.log("Server started.");

var game = new Game();

var Entity = function(){
	var self = {
		x:250,
		y:250,
		spdX:0,
		spdY:0,
		id:"",
	};
	self.update = function(){
		self.updatePosition();
	};
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
	};
	self.getDistance = function(pt){
	    //console.log('getDist : '+self.x+':'+self.y +' | ' + pt.x+':'+pt.y);
		return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
	};
	return self;
};

var DEBUG = true;

var io = require('socket.io')(serv);

// 1) a client connects to the server
io.sockets.on('connection', function(socket){

	// 2) a random socket id is giving to him
	socket.id = Math.random();
	var sock = socket;
	globale.SOCKET_LIST[socket.id] = socket;

	// 3) When the client enter a pseudo, we add him to a free room
	socket.on("login", function(data){
		console.log("LOGIN pseudo " + data);

		// TODO check if pseudo is already taken

		game.createPlayer(socket, data);

		socket.emit("playerCreated", true);
	});

/*
	players.onConnect(socket);
	for(var i in globale.SOCKET_LIST)
	{
		if(globale.SOCKET_LIST[i].id  !== socket.id)
		{
				var socket = globale.SOCKET_LIST[i];
				socket.emit('init',{
					player:players.getAllInitPack(),
					bullet:bullets.getAllInitPack()});
		}
	}*/

	socket.on('disconnect',function(){
		console.log('disconnect : '+sock.id);

		game.removePlayer(socket);
		/*var room = rooms.getRoomByPlayerId(sock.id);
		if(room !== -1)
			room.removePlayer(sock);
		else
			console.log("Player was not in a room");
		delete globale.SOCKET_LIST[sock.id];*/

	});

	socket.on('sendMsgToServer',function(data){
		var player = game.findPlayerBySocket(socket);
		if(player === undefined) {
			console.log("Player attached to socket " + socket.id + " not found.")
			return;
		}

		for(var i in globale.SOCKET_LIST){
			globale.SOCKET_LIST[i].emit('addToChat', player.pseudo + ': ' + data);
		}
	});
	
	socket.on('evalServer',function(data){
		if(!DEBUG)
			return;
		var res = eval(data);
		socket.emit('evalAnswer',res);		
	});
});

setInterval(function(){

	//console.log(rooms)
	// console.log(globale.SOCKET_LIST)
	game.update();
	
},1000/25);

//Loop for network
setInterval(function(){
	game.updatePack();
},1000/15);


// Loop for placing players in rooms
setInterval(function(){

	game.findRoomForWaitingPlayer();
	//console.log(game.gamePlayers)

},1000);

/*var startProfiling = function(time)
{
    profiler.startProfiling('1',true);
    setTimeout(function() {
        var profile1 = profiler.stopProfiling('1');
        profile1.export(function (error, result) {
            fs.writeFile('./profilev2.cpuprofile', result);
            profile1.delete();
            console.log('profile saved');
        });

    },time);
}
startProfiling(10000);*/