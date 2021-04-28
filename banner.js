const Bcanvas = document.getElementById("textCanvas");
Bcanvas.setAttribute('width', window.innerWidth);
Bcanvas.setAttribute('height', 400);
const Bctx = Bcanvas.getContext("2d");
let particleArray = [];
let particleSize = 10;

// get mouse mouse position //
let mouse = {
    x: null,
    y: null,
    radius: 150
}

Bcanvas.addEventListener('mousemove', (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY;
});

Bctx.font = 'bold 16px Verdana';
var gradient = Bctx.createLinearGradient(0, 0, 70, 0);
gradient.addColorStop("0", "magenta");
gradient.addColorStop("1", "blue");
// Fill with gradient
Bctx.fillStyle = gradient;
Bctx.fillText('SARIKU', 5, 30);
const data = Bctx.getImageData(0, 0, Bcanvas.width, 100);

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
        Bctx.fillStyle = this.color;
        Bctx.beginPath();
        Bctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        Bctx.closePath();
        Bctx.fill();
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

for (let y = 0; y < data.height; y++) {
    for (let x = 0; x < data.width; x++) {
        if (data.data[((x + y * data.width) * 4) + 3] > 128) {
            let index = (x + y * data.width) * 4;
            let R = data.data[index];
            let G = data.data[index + 1];
            let B = data.data[index + 2];
            let color = "rgb(" + R + "," + G + "," + B + ")";
            particleArray.push(new Particle(x * 15 - 80 + (Bcanvas.width /4), y * 15 - 150, color));
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

                Bctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                Bctx.lineWidth = 2;
                Bctx.beginPath();
                Bctx.moveTo(particleArray[a].x, particleArray[a].y);
                Bctx.lineTo(particleArray[b].x, particleArray[b].y);
                Bctx.stroke();
            }
        }
    }
}

function animate(){
    Bctx.clearRect(0,0,innerWidth,innerHeight);

    connect();

    particleArray.forEach((particle) => {
        particle.Update()
        particle.Draw()
    })

    requestAnimationFrame(animate);
}
animate();