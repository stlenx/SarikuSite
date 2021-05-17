class Ant {
    constructor(x, y, direction, threshold) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.hasFood = false;
        this.angle = Math.PI * direction / 180;
        this.elapsed = 0;
        this.threshold = threshold;
    }

    set direction(angle) {
        this.angle = Math.PI * angle / 180;
    }

    Move() {
        if(this.elapsed > this.threshold) {
            this.elapsed = 0;
            this.ChooseDir()
        } else {
            this.elapsed+=1;

            let x = this.x + Math.cos(this.angle) * this.speed;
            let y = this.y + Math.sin(this.angle) * this.speed;

            this.x = x;
            this.y = y;
        }
        if(this.hasFood) {
            world[Math.floor(this.x)][Math.floor(this.y)].beta += 1;
        } else {
            world[Math.floor(this.x)][Math.floor(this.y)].alfa += 1;
        }
    }

    ChooseDir() {
        if(this.x < 200) this.angle += Math.PI;
        if(this.x > canvas.width - 200) this.angle -= Math.PI;
        if(this.y < 200) this.angle += Math.PI;
        if(this.y > canvas.height - 200) this.angle -= Math.PI;

        let radius = 10;
        let distance = 20
        //Left
        let x1 = this.x + Math.cos(this.angle - 0.785398) * distance;
        let y1 = this.y + Math.sin(this.angle - 0.785398) * distance;
        //Middle
        let x2 = this.x + Math.cos(this.angle) * distance;
        let y2 = this.y + Math.sin(this.angle) * distance;
        //Right
        let x3 = this.x + Math.cos(this.angle + 0.785398) * distance;
        let y3 = this.y + Math.sin(this.angle + 0.785398) * distance;

        let left = 0;
        for(let x = x1 - radius; x < x1 + radius; x++) {
            for(let y = y1 - radius; y < y1 + radius; y++) {
                left += world[Math.floor(x)][Math.floor(y)].beta;
                if(world[Math.floor(x)][Math.floor(y)].food) {
                    left = Infinity;
                }
            }
        }

        let middle = 0;
        for(let x = x2 - radius; x < x2 + radius; x++) {
            for(let y = y2 - radius; y < y2 + radius; y++) {
                middle += world[Math.floor(x)][Math.floor(y)].beta;
                if(world[Math.floor(x)][Math.floor(y)].food) {
                    middle = Infinity;
                }
            }
        }

        let right = 0;
        for(let x = x3 - radius; x < x3 + radius; x++) {
            for(let y = y3 - radius; y < y3 + radius; y++) {
                right += world[Math.floor(x)][Math.floor(y)].beta;
                if(world[Math.floor(x)][Math.floor(y)].food) {
                    right = Infinity;
                }
            }
        }

        let newPos = [{x: x1, y: y1, angle: this.angle - 0.785398}, {x: x2, y: y2, angle: this.angle}, {x: x3, y: y3, angle: this.angle + 0.785398}]
        let direction = WeightedRandom([1 + left, 1 + middle, 1 + right])
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