class Ball {
    constructor(x, y, color, v, r) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.v = v;
        this.r = r;
        this.combo = 1;
    }

    Draw() {
        if(shadows) {
            let vector = getVector2({x: width / 2, y: 0},{x: this.x + this.r, y: this. y})
            let nVector = new Vector2(vector.y * -1, vector.x);
            nVector.normalize()
            let pos1 = new Vector2(this.x - nVector.x * this.r, this.y - nVector.y * this.r)
            let pos2 = new Vector2(this.x + nVector.x * this.r, this.y + nVector.y * this.r)

            let grd = ctx.createLinearGradient(this.x,this.y,this.x,this.y + this.r + width * 0.0333);
            grd.addColorStop(0,"rgba(0,0,0,0.17)");
            grd.addColorStop(1,"rgba(255,255,255,0)");
            // Fill with gradient
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y)
            ctx.lineTo(pos2.x, pos2.y)
            ctx.lineTo(pos1.x + vector.x, pos1.y + vector.y)
            ctx.lineTo(pos2.x + vector.x, pos2.y + vector.y)
            ctx.fill()
            ctx.closePath()

        }

        ctx.fillStyle = this.color;
        let circle = new Path2D()
        circle.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill(circle);
    }

    AddSpeed(dt) {
        let interval = dt / 16;
        this.x += this.v.x * interval;
        this.y += this.v.y * interval
    }

    ResetSpeed() {
        this.v = new Vector2(0,0)
    }

    BrickCollide(i) {
        if(this.y + this.r > bricks[i].y && this.y - this.r < bricks[i].y + bricks[i].h && this.x + this.r > bricks[i].x && this.x - this.r < bricks[i].x + bricks[i].w) {
            new Sound("sounds/break.wav", volume).play();
            let points = 100 * this.combo * balls.length;
            if (hardMode) points *= 2;
            score += points;
            this.combo++;
            this.v.y *= -1;
            return true;
        }
        return false;
    }

    PlatformCollide() {
        this.combo = 1;
        if(this.v.y > 0) this.v.y *= -1
        let vector = getVector2({x: platform.x + platform.w / 2, y: platform.y}, {x: this.x, y: this.y})
        new Sound("sounds/bounce.wav", volume).play();

        //Fancy ball bounce thingy
        if(this.x < platform.x + platform.w / 2) {
            if(this.v.x > 0) this.v.x *= -1;
            this.v.x -= vector.x / 10;
            return;
        }
        if(this.v.x < 0) this.v.x *= -1;
        this.v.x += vector.x / 10;
    }

    Wall() {
        if(this.x + this.r > width && this.v.x > 0) {
            this.v.x *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
        if(this.x + this.r < 0 && this.v.x < 0) {
            this.v.x *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
        if(this.y + this.r < 0 && this.v.y < 0) {
            this.v.y *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
    }
}