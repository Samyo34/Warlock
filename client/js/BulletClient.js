    var Bullet = function(initPack){

      var self = {};
      self.id = parseFloat(initPack.id/100000000);
      self.spellName = initPack.spellName;

      self.parentID = parseFloat(initPack.parentID/100000000);
      self.x = initPack.x-camera.x;
      self.y = initPack.y-camera.y;
      self.orientation = initPack.orientation;
      self.range = 0;
      if(initPack.range !== undefined)
      {
        self.range = initPack.range;
      }

        self.draw = function()
        {

            var x = self.x;
            var y = self.y;

            var width = Img.fireball.width;
            var height = Img.fireball.height;

            if(self.spellName === 0/*"fireball"*/)
            {
    				ctx.save(); // save current state
    				ctx.translate(x,y);
    				ctx.rotate(self.orientation); // rotate
                    ctx.drawImage(Img.fireball, 0,0,width,height, -width/2,-height/2,width,height);
                    ctx.restore();
                }
                else if (self.spellName === 1/*"lightning"*/)
                {
                	var parent = players[self.parentID];
                    var x_start = parent.x+16*Math.cos(parent.rotation);
                    var y_start = parent.y+16*Math.sin(parent.rotation);
                    drawLightningSpell(x_start, y_start, x, y);
                }
                else if(self.spellName === 2/*"scurge"*/)
                {
                    var parent = players[self.parentID];
                    var x_start = parent.x;
                    var y_start = parent.y;
                    ctx.save();
                    ctx.translate(x_start,y_start);
                    //console.log("draw image : " + x+":"+y);
                    ctx.drawImage(Img.scurge,186,94,87,87,-self.range/2,-self.range/2,self.range,self.range);
                    ctx.restore();
                }
            };

            self.onUpdate = function(updatePack)
            {
                self.id = parseFloat(updatePack[0]/100000000);
                self.spellName = updatePack[1];
                self.parentID = parseFloat(updatePack[2]/100000000);
                self.x = updatePack[3]-camera.x;
                self.y = updatePack[4]-camera.y;
                self.orientation = parseFloat(updatePack[5]/100000000);
                self.range =updatePack[6];
            };

            return self;
    };