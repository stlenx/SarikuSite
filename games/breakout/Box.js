class Box {
    constructor(x,y,color, r, s) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = r;
        this.s = s;
    }

    Draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.r,this.r);
    }
}