class Brick {
    constructor(x, y, color, w, h) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.w = w;
        this.h = h;
    }

    Draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}