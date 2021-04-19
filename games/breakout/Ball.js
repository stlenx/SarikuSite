class Ball {
    constructor(x, y, color, vx, vy, r) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.combo = 1;
    }

    Draw() {
        ctx.fillStyle = this.color;
        let circle = new Path2D()
        circle.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill(circle);
    }

    AddSpeed(dt) {
        let interval = dt / 16;
        this.x += this.vx * interval;
        this.y += this.vy * interval;
    }

    ResetSpeed() {
        this.vx = 0;
        this.vy = 0;
    }

    BrickCollide(i) {
        if(this.y + this.r > bricks[i].y && this.y - this.r < bricks[i].y + bricks[i].h && this.x + this.r > bricks[i].x && this.x - this.r < bricks[i].x + bricks[i].w) {
            new Sound("sounds/break.wav", volume).play();
            let points = 100 * this.combo * balls.length;
            if (hardMode) points *= 2;
            score += points;
            this.combo++;
            this.vy *= -1;
            return true;
        }
        return false;
    }

    PlatformCollide() {
        this.combo = 1;
        if(this.vy > 0) this.vy *= -1
        let vector = getVector2({x: platform.x + platform.w / 2, y: platform.y}, {x: this.x, y: this.y})
        new Sound("sounds/bounce.wav", volume).play();

        //Fancy ball bounce thingy
        if(this.x < platform.x + platform.w / 2) {
            if(this.vx > 0) this.vx *= -1;
            this.vx -= vector.x / 10;
            return;
        }
        if(this.vx < 0) this.vx *= -1;
        this.vx += vector.x / 10;
    }

    Wall() {
        if(this.x + this.r > width && this.vx > 0) {
            this.vx *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
        if(this.x + this.r < 0 && this.vx < 0) {
            this.vx *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
        if(this.y + this.r < 0 && this.vy < 0) {
            this.vy *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
    }
}