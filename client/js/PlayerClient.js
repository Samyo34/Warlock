    var Player = function(initPack){
        var self = {};
        self.id = parseFloat(initPack.id/100000000);
        self.number = initPack.number;
        self.x = parseInt(initPack.x-camera.x);
        self.y = parseInt(initPack.y-camera.y);
        self.rotation = parseFloat(initPack.rotation);
        self.hp = parseInt(initPack.hp);
        self.hpMax = parseInt(initPack.hpMax);
        //self.hp = initPack.hp;
        self.targetVisible = initPack.targetVisible;
        self.targetType = initPack.targetType;
        self.isDead = initPack.isDead;
        self.isShooting = initPack.isShooting;
        self.isMoving = initPack.isMoving;
        self.size = parseInt(initPack.sizePlayer);

        self.indexMove = 0;
        self.indexCast = 0;
        self.lastChangeTransiTime = 0;
        self.lastChangeTransiTimeC = 0;
        self.lastX = 0;
        self.lastY = 0;

        self.indexMoveX = [2,49,96,145,2,51,99];
        self.indexMoveY = [148,148,148,148,196,196,196];
        self.indexCastX = [1,51,102,152,197];
        self.indexCastY = [292,292,292,292,292];

        self.spellCooldowns = {
         fireball: 0,
         blink: 0,
     };

     self.draw = function(){
        if(self.isDead === 0) {
            var x = self.x;
            var y = self.y;
            /*
            var width = Img.player.width;
            var height = Img.player.height;
            */
            var width = 44;
            var height = 44;

            if(self.isShooting === 1)
            {
                if(Date.now() > self.lastChangeTransiTimeC + 200){
                    self.indexCast++;
                    //changement de transition
                    if(self.indexCast >= self.indexCastX.length){
                        self.indexCast = 0;
                    }

                    self.lastChangeTransiTimeC = Date.now();
                }
            }
            else
            {
                if(Date.now() > self.lastChangeTransiTime + 1000/25){
                    self.indexMove++;
                    
                    //changement de transition
                    if(self.indexMove >= self.indexMoveX.length-1)
                    {
                        self.indexMove = 0;
                    }

                    self.lastChangeTransiTime = Date.now();
                }
            }
            if(self.isMoving === 0)
            {
                self.indexMove = 0;
            }
            //console.log('id : '+self.id + ':'+selfId);

            ctx.save(); // save current state
            ctx.translate(self.x, self.y);
            ctx.rotate(self.rotation + ((-90 * Math.PI) / 180)); // rotate
            if (self.id === selfId)
            {
                if (self.isShooting === 1)
                {
                    ctx.drawImage(Img.playerSheet, self.indexCastX[self.indexCast], self.indexCastY[self.indexCast], width, height, -(self.size/2), -(self.size/2), self.size, self.size);
                }
                else
                {
                    //console.log('draw '+self.size);
                    ctx.drawImage(Img.playerSheet, self.indexMoveX[self.indexMove], self.indexMoveY[self.indexMove], width, height, -(self.size/2), -(self.size/2), self.size, self.size);
                }
            }
            else
            {
                if (self.isShooting === 1) 
                {
                    ctx.drawImage(Img.playerSheet_enemy, self.indexCastX[self.indexCast], self.indexCastY[self.indexCast], width, height, -(self.size/2), -(self.size/2), self.size, self.size);
                }
                else
                {
                    ctx.drawImage(Img.playerSheet_enemy, self.indexMoveX[self.indexMove], self.indexMoveY[self.indexMove], width, height, -(self.size/2), -(self.size/2), self.size, self.size);
                }

            } //ctx.translate(-transX,-transY);
            ctx.restore();

            ctx.save();
            //ctx.translate(self.x, self.y);
            // Draw healthbar:
            ctx.fillStyle = "#000000";
            // green
            ctx.strokeRect(self.x-(self.size/2)-4, self.y-(self.size/2) - 13, 38+2, 5+ 2);
            if(self.id === selfId) {
                ctx.fillStyle = "#34C924"; // green
            }
            else
            {
            ctx.fillStyle="#FF0000"; // red
        }
        ctx.fillRect(self.x-(self.size/2)-3, self.y - (self.size/2) - 12, (self.hp* 38 ) / self.hpMax, 5);

            //ctx.restore();
        }
    };

    self.drawTarget = function(){
     if(self.id === selfId) {
        if (self.targetVisible === 0 || self.targetType === "") {
           return;
       }
       else
       {
           var width = Img.spell_target.width;
           var height = Img.spell_target.height;
           ctx.drawImage(Img.spell_target, mouse_X - (width/2), mouse_Y - (height/2));
       }
   }
};

    self.onUpdate = function(dataArray)
    {
           // console.log(dataArray[0]+';'+dataArray[1]+';'+dataArray[2]+';'+dataArray[3]+';'+parseFloat(dataArray[4]/100000)+';'+dataArray[5]+';'+dataArray[6]+';'+dataArray[7]+';'+dataArray[8]+';'+dataArray[9]);
           self.id = parseFloat(dataArray[0]/100000000);
            //self.number = dataArray[1];
            self.x = parseInt(dataArray[1]-camera.x);
            self.y = parseInt(dataArray[2]-camera.y);
            self.rotation = parseFloat(dataArray[3]/100000000);
            self.hp = parseInt(dataArray[4]);
            self.hpMax = parseInt(dataArray[5]);
            self.targetVisible = dataArray[6];
            if(dataArray[7])
                self.targetType = dataArray[7];

            self.isDead = dataArray[8];

            self.isShooting = dataArray[9];
            self.isMoving = dataArray[10];
            //console.log('update '+self.id+' '+dataArray[11]);
            self.size = parseInt(dataArray[11]);
           /* self.id = updatePack.id;
            self.number = updatePack.number;
            self.x = updatePack.x-camera.x;
            self.y = updatePack.y-camera.y;
            self.rotation = parseFloat(updatePack.rotation/100000);
            self.hp = updatePack.hp;
            self.hpMax = updatePack.hpMax;
            self.targetVisible = updatePack.targetVisible;
            self.targetType = updatePack.targetType;
            self.isDead = updatePack.isDead;
            self.size = updatePack.sizePlayer;
            self.isShooting = updatePack.isShooting;
            self.isMoving = updatePack.isMoving;*/
        };

        return self;
    };