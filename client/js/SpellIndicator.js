/**
 * Created by Matthias on 17/11/2016.
 */

/**
 * Class for the spell card
 */
var spellIndicator = function(name, keyboardKey, img, cd) {
    this.spellName = name;
    this.keyboardKey = keyboardKey;
    this.img = img;
    this.cdProgress = 0;
    this.cd = cd;
    this.cdCurrent=0;
};

spellIndicator.prototype.draw = function() {


    this.cdCurrent -= 1;
    if(this.cdCurrent < 0) // cooldown is finished
    {
        this.cdCurrent = 0;
    }
    else
    {
        this.cdProgress = this.cdCurrent/this.cd;
    }

    var ctx = getRightCtx(this.keyboardKey);

    var width = ctx.canvas.clientWidth;
    var height = ctx.canvas.clientHeight;

    var x = width/2;
    var y = height/2;
    var r = (height/2)*Math.sqrt(2);
    if(this.spellName === "scurge")
    {
        ctx.drawImage(this.img, 41, 235, 85, 83, 0, 0, width, height);
    }
    else
    {
        // Draw spell img:
        ctx.drawImage(this.img, 0, 0, width, height);
    }

    // Draw shortkey:
    ctx.font = '20pt Calibri';
    ctx.fillStyle = 'white';
    var xx = 7.5*width/10;
    var yy = 9.5*(height/10);
    ctx.fillText(this.keyboardKey, xx, yy);

    // Draw cooldown pie:
    if(this.cdProgress < 1 && this.cdProgress > 0.01)
    {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(x, y, r,  - Math.PI/2, (Math.PI * 2) * (1-this.cdProgress) -  Math.PI/2, true); // we draw the arc
        ctx.lineTo(x, y); // we add the center point in order to have a pie
        ctx.fill();

        ctx.globalCompositeOperation = 'destination-in'
        var squareSide = (2*r) / Math.sqrt(2);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(x - squareSide/2, y - squareSide/2, squareSide, squareSide);
    }

    ctx.globalCompositeOperation = 'source-over';
};

function getRightCtx(key) {
    var n;
    switch (key) {
        case "A":
            n = 0;
            break;
        case "Z":
            n = 1;
            break;
        case "E":
            n = 2;
            break;
        case "R":
            n = 3;
            break;
        default:
            n = -1;
    }

    var contextName = "ctxSpell_" + n;
    var ctxSpellIndic = document.getElementById(contextName).getContext("2d");

    return ctxSpellIndic;
}

