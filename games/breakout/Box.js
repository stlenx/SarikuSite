class Box {
    constructor(x,y,color, r, s) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = r;
        this.s = s;
    }

    Draw() {
        if(shadows) {
            let vector = getVector2({x: width / 2, y: 0},{x: this.x + this.r / 2, y: this. y})
            vector.normalize()
            vector.mult(new Vector2(4,4))

            ctx.fillStyle = "rgba(0,0,0,0.2)"
            ctx.fillRect(this.x + vector.x,this.y + vector.y,this.r,this.r);
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.r,this.r);
    }
}