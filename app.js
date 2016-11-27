var express = require('express');
var app = express();
var serv = require('http').Server(app);

//var profiler = require('v8-profiler');
var fs = require('fs');
console.log(__dirname+'/Server/Player.js');

eval(fs.readFileSync(__dirname+'/Server/Player.js')+'');
eval(fs.readFileSync(__dirname+'/Server/Bullet.js')+'');
eval(fs.readFileSync(__dirname+'/Server/SpellsCards.js')+'');
eval(fs.readFileSync(__dirname+'/Server/Spells.js')+'');


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

var SOCKET_LIST = {};

var map_array = [369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369, 369];
var LAVA = 369;
var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

var bullets = new Bullet();

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


io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	var sock = socket;
	SOCKET_LIST[socket.id] = socket;

	Player.onConnect(socket);
	for(var i in SOCKET_LIST)
	{
		if(SOCKET_LIST[i].id  !== socket.id)
		{
				var socket = SOCKET_LIST[i];
				socket.emit('init',{
					player:Player.getAllInitPack(),
					bullet:bullets.getAllInitPack()});
		}
	}

	socket.on('disconnect',function(){
		console.log('disconnect : '+sock.id);
		Player.onDisconnect(sock);
		delete SOCKET_LIST[sock.id];
		
		for(var i in SOCKET_LIST)
		{
			var socket = SOCKET_LIST[i];
			socket.emit('init',{
				player:Player.getAllInitPack(),
				bullet:bullets.getAllInitPack()});
		}
	});

	socket.on('sendMsgToServer',function(data){
		var playerName = ("" + socket.id).slice(2,7);
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
		}
	});
	
	socket.on('evalServer',function(data){
		if(!DEBUG)
			return;
		var res = eval(data);
		socket.emit('evalAnswer',res);		
	});


	
});

var initPack = {player:[],bullet:[]};
var removePack = {player:[],bullet:[]};

setInterval(function(){
	//console.log(Player.update().byteLength);
	var bufferPlayers = Player.update();
	var bufferBullets = bullets.update();
	var packBuffer = new ArrayBuffer((bufferPlayers.byteLength+bufferBullets.byteLength));
	var viewPackBuffer = new Int32Array(packBuffer);
	//console.log(bufferPlayers.byteLength+' '+bufferBullets.byteLength+' '+packBuffer.byteLength+' '+viewPackBuffer.length*4);
	viewPackBuffer.set(new Int32Array(bufferPlayers),0);
	if(bufferBullets.byteLength > 0)
		viewPackBuffer.set(new Int32Array(bufferBullets),bufferPlayers.byteLength/4);

//console.log(viewPackBuffer[0]+' '+viewPackBuffer[14]);
	//console.log(packBuffer.byteLength+' '+bufferPlayers.byteLength+' '+bufferBullets.byteLength);


/*	var pack = {
		player:Player.update(),
		bullet:bullets.update(),
	};
	*/
/*	var pack = Player.update();*/
	var nbPlayer = 0;
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		//socket.send(new ArrayBuffer);
			if(initPack.player[0] || initPack.bullet[0])
			{
				//console.log(initPack.player[0]);
       		socket.emit('init',initPack);
       	}
        //console.log('app124 : removepack :'+removePack.bullet.length);
        socket.emit('update',packBuffer);
        nbPlayer++;
        if(removePack.bullet.length>0 || removePack.player.length>0)
        {
            //console.log('app105 : remove');
            socket.emit('remove',removePack);
        }

	}
	//console.log('nb players : '+nbPlayer);
			initPack.player = [];
			initPack.bullet = [];		
	 		removePack.player = [];
			removePack.bullet = [];

	
},1000/40);

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
