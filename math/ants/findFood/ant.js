class Ant {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.angle = Math.PI * direction / 180;
    }

    set direction(angle) {
        this.angle = Math.PI * angle / 180;
    }

    Move() {
        if(this.x < 100) this.angle += 3.14159;
        if(this.x > canvas.width - 100) this.angle -= 3.14159;
        if(this.y < 100) this.angle += 3.14159;
        if(this.y > canvas.height - 100) this.angle -= 3.14159;

        let radius = 10;

        //Left
        let x1 = this.x + Math.cos(this.angle - 0.785398) * this.speed;
        let y1 = this.y + Math.sin(this.angle - 0.785398) * this.speed;

        //Middle
        let x2 = this.x + Math.cos(this.angle) * 100;
        let y2 = this.y + Math.sin(this.angle) * 100;

        //Right
        let x3 = this.x + Math.cos(this.angle + 0.785398) * this.speed;
        let y3 = this.y + Math.sin(this.angle + 0.785398) * this.speed;
        console.log(x1, y1, x2, y2, x3, y3)

        let left = 0;
        for(let x = x1 - radius; x < x1 + radius; x++) {
            for(let y = y1 - radius; y < y1 + radius; y++) {
                left += world[Math.floor(x)][Math.floor(y)].beta;
            }
        }

        let middle = 0;
        for(let x = x2 - radius; x < x2 + radius; x++) {
            for(let y = y2 - radius; y < y2 + radius; y++) {
                middle += world[Math.floor(x)][Math.floor(y)].beta;
            }
        }

        let right = 0;
        for(let x = x3 - radius; x < x3 + radius; x++) {
            for(let y = y3 - radius; y < y3 + radius; y++) {
                right += world[Math.floor(x)][Math.floor(y)].beta;
            }
        }

        let newPos = [{x: x1, y: y1, angle: this.angle - 0.785398}, {x: x2, y: y2, angle: this.angle}, {x: x3, y: y3, angle: this.angle + 0.785398}]
        let direction = WeightedRandom([1 + left, 1 + middle, 1 + right])
        this.x = newPos[direction].x
        this.y = newPos[direction].y
        this.angle = newPos[direction].angle;
    }

    Draw() {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath()

        let x = this.x + Math.cos(this.angle) * 10;
        let y = this.y + Math.sin(this.angle) * 10;
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.closePath()
    }
}