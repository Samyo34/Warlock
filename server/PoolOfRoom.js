/**
 * Created by Matthias on 25/12/2016.
 */

"use strict";
var Room = require('./Room.js');

(function(){
    class PoolOfRoom extends Array {
        constructor(){
            super();
        }

        addNewRoom(nbPlayerMax, type, map) {
            this.push(new Room(nbPlayerMax, type, map));
        }

        removeRoomById(id) {
            for (var i=0; i<this.length; i++)
            {
                if(this[i].id === id) {
                    console.log("Delete room " + id)
                    delete this[i];
                    this.splice(i,1);

                    return this[i];
                }
            }
            return -1;
        }

        getRoomById(id) {
            for (var i=0; i<this.length; i++)
            {
                if(this[i].id === id)
                    return this[i];
            }
            return -1;
        }

        getRoomByPlayerId(playerId) {
            for (var i=0; i<this.length; i++)
            {
                for (var j=0; j<this[i].players.length; j++)
                {
                    if(this[i].players[j].id === playerId)
                    {
                        return this[i];
                    }
                }

            }
            return undefined;
        }

        addPlayerToFreeRoom(player)
        {
            var room = this.returnAFreeRoom();

            if (room === -1){
                this.addNewRoom(3,'deathMatch',{width:800,height:800});
                room = this.returnAFreeRoom();
            }

            room.addPlayer(player);
        }

        returnAFreeRoom()
        {
            for(var i = 0; i < this.length; i++)
            {
                if(this[i].players.length < this[i].nbPlayerMax) {
                    return this[i];
                }
            }
            return -1;
        }

        update()
        {
            for(var i = 0; i < this.length; i++)
            {
                this[i].update();
            }
        }

        updatePack()
        {
               for(var i = 0; i < this.length; i++)
            {
                this[i].updatePack();
            }
        }



    };

    module.exports = PoolOfRoom;

})();