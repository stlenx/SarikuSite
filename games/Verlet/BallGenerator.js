class BallGenerator {
    constructor(pos, radius, color, speed, angle) {
        this.pos = pos;

        this.radius = radius.random ? radius.radius : null;
        this.currentRadius = radius.radius;
        this.radiusVariety = radius.variety;
        this.radiusSpeed = radius.speed;

        this.color = color.random ? 0 : color.color;
        this.colorRandom = color.random;
        this.colorSpeed = color.speed;

        this.speed = speed;

        this.angle = angle.random ? angle.angle + 90 : null;
        this.currentAngle = angle.angle + 90;
        this.angleVariety = angle.variety;
        this.angleSpeed = angle.speed;


        this.time = 0;
        this.angleDir = false;
        this.colorDir = false;
        this.radiusDir = false;
    }

    update(dt, solver) {
        this.time += dt;

        if(this.time > this.speed) {
            this.time = 0;

            let rad = -this.currentAngle * (Math.PI / 180);
            let dir = new Vector2(Math.cos(rad), Math.sin(rad));
            dir.normalize();


            let color = this.getColor();

            solver.objects.push(new VerletObject(
                this.pos,
                false,
                color,
                this.currentRadius,
                new Vector2(this.pos.x + dir.x, this.pos.y + dir.y)
            ))

            if(this.angle !== null) {
                this.randomizeAngle();
            }

            if(this.radius !== null) {
                this.randomizeRadius();
            }
        }
    }

    getColor() {
        if(!this.colorRandom) {
            return this.color;
        }

        if(this.colorDir) {
            this.color -= this.colorSpeed;
        } else {
            this.color += this.colorSpeed;
        }
        if(this.color > 360 || this.color < 0) {
            this.colorDir = !this.colorDir;
        }

        return hslToHex(this.color, 100, 50);
    }

    randomizeAngle() {
        if(this.angleDir) {
            this.currentAngle -= this.angleSpeed;
        } else {
            this.currentAngle += this.angleSpeed;
        }

        if(this.currentAngle > this.angle + this.angleVariety || this.currentAngle < this.angle - this.angleVariety) {
            this.angleDir = !this.angleDir;
        }
    }

    randomizeRadius() {
        if(this.radiusDir) {
            this.currentRadius -= this.radiusSpeed;
        } else {
            this.currentRadius += this.radiusSpeed;
        }

        if(this.currentRadius > this.radius + this.radiusVariety || this.currentRadius < this.radius) {
            this.radiusDir = !this.radiusDir;
        }
    }

}