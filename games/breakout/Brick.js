class Brick {
    constructor(x, y, color, w, h) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.w = w;
        this.h = h;
    }

    Draw() {
        if(shadows) {
            let vector = getVector2({x: width / 2, y: 0},{x: this.x + this.w / 2, y: this. y})
            vector.normalize()
            vector.mult(new Vector2(2,2))

            ctx.fillStyle = "rgba(0,0,0,0.2)"
            ctx.fillRect(this.x + vector.x,this.y + vector.y,this.w,this.h);
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}