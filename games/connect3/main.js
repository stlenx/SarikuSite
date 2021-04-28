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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let particleSize = 10;

// get mouse mouse position //
let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', (e) => {
        mouse.x = e.offsetX
        mouse.y = e.offsetY;
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
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = particleSize;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = ((Math.random() * 60) + 1);
    }

    Draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    Update() {
        // check mouse position/particle position - collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        // distance past which the force is zero
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;

        // if we went below zero, set it to zero.
        force = force < 0 ? 0 : force;

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
    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x++) {
            if (data.data[((x + y * data.width) * 4) + 3] > 128) {
                let index = (x + y * data.width) * 4;
                let R = data.data[index];
                let G = data.data[index + 1];
                let B = data.data[index + 2];
                let color = "rgb(" + R + "," + G + "," + B + ")";
                particleArray.push(new Particle(x * 15, y * 15, color));
            }
        }
    }
}

function connect() {
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
                + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));
            if (distance < 3600) {
                let opacityValue = 1 - (distance / 3600);
                let dx = mouse.x - particleArray[a].x;
                let dy = mouse.y - particleArray[a].y;
                let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                if (mouseDistance < mouse.radius) {
                    particleArray[a].size = Remap(mouseDistance, 0, mouse.radius, 30, particleSize);
                } else {
                    particleArray[a].size = particleSize;
                }

                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate(){
    ctx.clearRect(0,0,innerWidth,innerHeight);

    connect();

    particleArray.forEach((particle) => {
        particle.Update()
        particle.Draw()
    })

    requestAnimationFrame(animate);
}
init();
animate();