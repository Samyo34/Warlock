var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');

eval(fs.readFileSync('./client/js/Player.js')+'');

app.get('/',function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

app.get( '/*' , function( req, res, next ) {
    var file = req.params[0];
    res.sendFile( __dirname + '/' + file );
});

server.listen(2000);
var nbPlayer = 1;

var PLAYERS = {};
var SOCKETS = {};



var io = require('socket.io')(server,{});
io.sockets.on('connection',function(socket){
    socket.id = nbPlayer;
    SOCKETS[nbPlayer] = socket;
    var player = new Player(nbPlayer);
    PLAYERS[nbPlayer] = player;
    nbPlayer++;
    console.log('socket connection');

    socket.emit('serverMsg',{
        msg:'Hello Player '+nbPlayer,
        id:player.id,
    });

    socket.on('disconnect',function(){
       delete PLAYERS[socket.id];
        delete SOCKETS[socket.id];
    });

    socket.on('mouseClick',function(data){
        var player = PLAYERS[socket.id];
        player.setGoalDest(data.x,data.y);
        player.currentSpeed = player.SPEED;
    });
});



//ticks server
setInterval(function(){
    var pack=[];
    for(var i in PLAYERS)
    {
        var player = PLAYERS[i];
       player.updatePlayer();

        pack.push({
            x:player.x,
            y:player.y,
            rotation:player.rotation,
            id:player.id
        });
    }

    for(var i in SOCKETS)
    {
        var socket = SOCKETS[i];
        socket.emit('updateServer',pack);
    }

},1000/25);

