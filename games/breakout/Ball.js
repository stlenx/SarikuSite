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

    AddSpeed() {
        this.x += this.vx;
        this.y += this.vy;
    }
}