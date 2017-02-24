    var Bullet = function(initPack, players){

      var self = {};
      self.id = parseFloat(initPack.id/100000000);
      self.spellCode = initPack.spellCode;
      //self.spellName = self.getNameByCode(self.spellCode);
      self.players = players;

      self.positions = [];

      self.parentID = parseFloat(initPack.parent/100000000);
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
                	var parent = self.players[self.parentID];
                    var x_start = parent.x+16*Math.cos(parent.rotation);
                    var y_start = parent.y+16*Math.sin(parent.rotation);
                    drawLightningSpell(x_start, y_start, x, y);
                }
                else if(self.spellName === 2/*"scurge"*/)
                {
                    console.log(self.parentID)
                    var parent = self.players[self.parentID];
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
                self.positions.push({x:(parseInt(updatePack[3])-camera.x),
                                y:(parseInt(updatePack[4])-camera.y),
                                });
                self.positions[self.positions.length-1].t = Date.now();
/*                self.x = updatePack[3]-camera.x;
                self.y = updatePack[4]-camera.y;*/
                self.orientation = parseFloat(updatePack[5]/100000000);
                self.range =updatePack[6];
            };

    self.interpolate = function(tps,camera){
        var interptime = tps - 60;
        //console.log(self.positions);
        for(var i = 0; self.positions.length-2;i++){
            if(self.positions[i].t <= interptime && self.positions[i + 1].t >= interptime){
/*                self.preX = self.x;
                self.preY = self.y;*/
                var ratio = (interptime - self.positions[i].t)/(self.positions[i + 1].t - self.positions[i].t);
                var x = Math.round(self.positions[i].x + ratio * (self.positions[i + 1].x - self.positions[i].x));
                var y = Math.round(self.positions[i].y + ratio * (self.positions[i + 1].y - self.positions[i].y));
                self.x = x;
                self.y = y;
                console.log('inter '+self.pseudo+' '+x+':'+y);
                self.positions.splice(0, i);
                break;
            }
        }
    };


            self.getNameByCode = function(code)
            {
                if(code === 0)
                {
                    return 'fireball';
                }

                if(code === 1)
                {
                    return 'lightning';
                }

                if(code === 2)
                {
                    return 'scurge';
                }
                return '';
            }

            return self;
    };