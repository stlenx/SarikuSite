//let canvas = document.getElementById("canvas");
//canvas.setAttribute('width', window.innerHeight)
//canvas.setAttribute('height', window.innerHeight)
//let ctx = canvas.getContext('2d')
//
//let board = new Board(canvas.width, canvas.height)
//
//function frame() {
//    Draw()
//
//    window.requestAnimationFrame(frame)
//}
//
//function Draw() {
//    ctx.clearRect(0,0,canvas.width, canvas.height)
//
//    board.Draw()
//}
//
//window.requestAnimationFrame(frame)

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;
let particleArray = [];
let adjustX = -10;
let adjustY = 3;

// get mouse mouse position //
let mouse = {
    x: null,
    y: null,
    radius: 150
}

let canvasPosition = canvas.getBoundingClientRect();
window.addEventListener('mousemove',
    function(e){
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
    });

ctx.font = 'bold 16px Verdana';
var gradient = ctx.createLinearGradient(0, 0, 70, 0);
gradient.addColorStop("0", "magenta");
gradient.addColorStop("1", "blue");
// Fill with gradient
ctx.fillStyle = gradient;
ctx.fillText('SARIKU', 5, 30);
const data = ctx.getImageData(0, 0, canvas.width, 100);

class Particle {
    constructor(x, y, color){
        this.x = x + 200;
        this.y = y - 100;
        this.color = color;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = ((Math.random() * 60) + 1);
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        // check mouse position/particle position - collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        // distance past which the force is zero
        var maxDistance = mouse.radius;
        // convert (0...maxDistance) range into a (1...0).
        // Close is near 1, far is near 0
        // for example:
        //   250 => 0.75
        //   100 => 0.9
        //   10  => 0.99
        var force = (maxDistance - distance) / maxDistance;

        // if we went below zero, set it to zero.
        if (force < 0) force = 0;

        let directionX = (forceDirectionX * force * this.density)
        let directionY = (forceDirectionY * force * this.density);

        if (distance < mouse.radius + this.size){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX ) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            } if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}
function init(){
    console.log(data)
    particleArray = [];

    for (var y = 0, y2 = data.height; y < y2; y++) {
        for (var x = 0, x2 = data.width; x < x2; x++) {
            if (data.data[((x + y * data.width) * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                let index = (x + y * data.width) * 4;
                let R = data.data[index];
                let G = data.data[index + 1];
                let B = data.data[index + 2];
                let color = "rgb(" + R + "," + G + "," + B + ")";
                //let positionX = x;
                //let positionY = y;
                particleArray.push(new Particle(positionX * 15, positionY * 15, color));
            }
        }
    }
    console.log(data.height, data.width)

}
function animate(){
    //ctx.fillStyle = 'rgba(0,0,0,0.5)';
    //ctx.fillRect(0,0,innerWidth,innerHeight);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    connect();

    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update();
        particleArray[i].draw();
    }

    ctx.font = 'bold 16px Verdana';
    var gradient = ctx.createLinearGradient(0, 0, 50, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
// Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText('SARIKU', 5, 30);
    const data = ctx.getImageData(0, 0, canvas.width, 100);

    requestAnimationFrame(animate);
}
init();
animate();
/*
// RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
window.addEventListener('resize',
function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});*/


function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance = (( particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
                + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));

            if (distance < 3600) {

                opacityValue = 1 - (distance/3600);
                let dx = mouse.x - particleArray[a].x;
                let dy = mouse.y - particleArray[a].y;
                let mouseDistance = Math.sqrt(dx*dx+dy*dy);
                if (mouseDistance < mouse.radius / 2) {
                    particleArray[a].size = 25;
                    ctx.strokeStyle='rgba(255,255,150,' + opacityValue + ')';
                } else if (mouseDistance < mouse.radius - 50) {
                    particleArray[a].size = 20;
                    ctx.strokeStyle='rgba(255,255,180,' + opacityValue + ')';
                } else if (mouseDistance < mouse.radius + 20) {
                    particleArray[a].size = 15;
                    ctx.strokeStyle='rgba(255,255,210,' + opacityValue + ')';
                } else  {
                    particleArray[a].size = 8;
                    ctx.strokeStyle='rgba(255,255,255,' + opacityValue + ')';
                }
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }

    }
}

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});