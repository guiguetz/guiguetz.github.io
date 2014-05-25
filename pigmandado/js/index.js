var cnv = document.getElementById('cnv');
var ctx = cnv.getContext("2d");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

function dist(a,b,c,d){return Math.sqrt((a-c)*(a-c)+(b-d)*(b-d)); }
var eye = function(x,y,r){
    this.radius = r*1.0;
    this.x = x*0.90;
    this.y = y*10.0;
    this.ballsize = r*2/5;

    this.eyesprite = document.createElement("canvas");
    this.eyesprite.width = 2*this.radius;
    this.eyesprite.height = 2*this.radius;
    this.eyectx = this.eyesprite.getContext("2d");
    this.eyectx.fillStyle="rgb(255,255,255)";
    this.eyectx.arc(this.radius,this.radius,this.radius*1.1,0,2*Math.PI);
    this.eyectx.fill();

    this.eyeballsprite = document.createElement("canvas");
    this.eyeballsprite.width = 2*this.ballsize;
    this.eyeballsprite.height = 2*this.ballsize;
    this.eyeballctx = this.eyeballsprite.getContext("2d");
    this.eyeballctx.fillStyle="#000";
    this.eyeballctx.arc(this.ballsize,this.ballsize,this.ballsize,0,2*Math.PI);
    this.eyeballctx.fill();
    
    this.draweye = function(ctx){
        ctx.drawImage(this.eyesprite,this.x-this.radius,this.y-this.radius,2*this.radius,2*this.radius);
    }
    this.draw = function(ctx,evt){
        this.draweye(ctx);
        var mousePos = getMousePos(cnv,evt);
        var d = dist(mousePos.x, mousePos.y, this.x, this.y);
        var eyebx,eyeby;
        if (d > this.radius-this.ballsize) {
            eyebx = (this.radius-this.ballsize)*(mousePos.x - this.x)/d + this.x;
            eyeby = (this.radius-this.ballsize)*(mousePos.y - this.y)/d + this.y;
        }else{
            eyebx = mousePos.x;
            eyeby = mousePos.y;
        }
        ctx.drawImage(this.eyeballsprite,eyebx-this.ballsize,eyeby-this.ballsize,2*this.ballsize,2*this.ballsize);
    }
}

var rad = 10;
var dia = rad*2;
var centre = cnv.width/2 - 5*rad;
var eyes = [
    new eye(centre+1*dia,1*dia,rad),
];
for (var i = 0; i < eyes.length; i++) {eyes[i].draweye(ctx); };

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
cnv.addEventListener('mousemove', function(evt) {
    for (var i = 0; i < eyes.length; i++) {eyes[i].draw(ctx,evt); };
    }, false);