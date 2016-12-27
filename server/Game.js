/**
 * Created by Matthias on 25/12/2016.
 */

"use strict";
var PoolOfRoom = require('./PoolOfRoom.js');
var Player = require('./Player.js');

(function(){
    class Game {
        constructor(){
            this.gameRooms = new PoolOfRoom();
            this.gamePlayers = {    playersPlaying: [],
                                    playersWaiting: [],
                                };
        }
        createPlayer(socket, pseudo) {
            this.gamePlayers.playersWaiting.push(new Player(socket, pseudo));
            console.log(this.gamePlayers)
        }

        removePlayer(socket) {
            // Remove player from the room:
            var room = this.gameRooms.getRoomByPlayerId(socket.id);
            if(room === undefined)
            {
                console.log("Error, room returned by getRoomByPlayerId undefined")
                return;
            }
            for (var i=0; i<this.gameRooms.length; i++)
            {
                if(this.gameRooms[i].id === room.id)
                {
                    console.log("Remove player " + socket.id + " from gameRooms array")
                    this.gameRooms[i].removePlayer(socket);
                }

            }

            // Remove player from the playerPlaying list:
            for (var i=0; i<this.gamePlayers.playersPlaying.length; i++)
            {
                if(this.gamePlayers.playersPlaying[i].id === socket.id) {
                    console.log("Remove player " + socket.id + " from playersPlaying array")
                    delete this.gamePlayers.playersPlaying[i];
                    this.gamePlayers.playersPlaying.splice(i,1);
                    return;
                }
            }
            console.log("Impossible to remove player " + socket.id + " from playersPlaying array, not existing")

        }

        findRoomForWaitingPlayer() {
            for(var i=this.gamePlayers.playersWaiting.length-1; i>=0; i--)
            {
                this.gameRooms.addPlayerToFreeRoom(this.gamePlayers.playersWaiting[i]);
                this.gamePlayers.playersPlaying.push(this.gamePlayers.playersWaiting[i]);
                this.gamePlayers.playersWaiting.pop();
            }
        }

        cleanRooms() {
            for (var i=0; i<this.gameRooms.length; i++)
            {
                if(this.gameRooms[i].hasToBeRemoved)
                {
                    delete this.gameRooms[i];
                    this.gameRooms.splice(i,1);
                }
            }
        }

        findPlayerBySocket(socket) {
            for(var i=0; i<this.gamePlayers.playersPlaying.length; i++)
            {
                if(this.gamePlayers.playersPlaying[i].id === socket.id)
                {
                    return this.gamePlayers.playersPlaying[i];
                }
            }
            for(var i=0; i<this.gamePlayers.playersWaiting.length; i++)
            {
                if(this.gamePlayers.playersWaiting[i].id === socket.id)
                {
                    return this.gamePlayers.playersWaiting[i];
                }
            }
            return undefined;
        }

        update() {
            //console.log(this.gameRooms)

            // Let's update all the rooms:
            this.gameRooms.update();
            // Let's clean the empty rooms:
            this.cleanRooms();
        }
    };

    module.exports = Game;

})();







