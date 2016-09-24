var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req,res){
    res.sendFile(__dirname +'/client/index.html');
});

app.use('client/',express.static(__dirname+'client'));

server.listen(2000);
var nbPlayer = 1;

var PLAYERS = {};

var io = require('socket.io')(server,{});
io.sockets.on('connection',function(socket){
    socket.id = nbPlayer;
    socket.x = 0;
    socket.y = 0;
    PLAYERS[nbPlayer] = socket;
    nbPlayer++;
    console.log('socket connection');

    socket.emit('serverMsg',{
        msg:'Hello Player '+nbPlayer,
    });

    socket.on('disconnect',function(){
       delete PLAYERS[socket.id];
    });
});

//ticks server
setInterval(function(){
    var pack=[];
    for(var i in PLAYERS)
    {
        var socket = PLAYERS[i];
        socket.x++;
        socket.y++;

        pack.push({
            x:socket.x,
            y:socket.y
        });
    }

    for(var i in PLAYERS)
    {
        var socket = PLAYERS[i];
        socket.emit('updateServer',pack);
    }

},1000/25);