class Wall {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }

    hit(pos1, pos2) {
        return this.intersects(pos1, pos2, this.pos, this.pos.ReturnAdd(this.dir));
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.dir.x, this.pos.y + this.dir.y);
        ctx.stroke();
        ctx.closePath()
    }

    //Sauce
    //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    intersects(p1, p2, p3, p4) {
        let D =  (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

        if(D === 0) return false;

        let P = new Vector2(0,0);

        P.x = ((p1.x*p2.y - p1.y*p2.x)*(p3.x - p4.x) - (p1.x - p2.x)*(p3.x*p4.y - p3.y*p4.x)) / D;
        P.y = ((p1.x*p2.y - p1.y*p2.x)*(p3.y - p4.y) - (p1.y - p2.y)*(p3.x*p4.y - p3.y*p4.x)) / D;

        if(P.x > Math.min(p1.x, p2.x) && P.x < Math.max(p1.x, p2.x) && P.y > Math.min(p1.y, p2.y) && P.y < Math.max(p1.y, p2.y)) {
            if(P.x > Math.min(p3.x, p4.x) && P.x < Math.max(p3.x, p4.x) && P.y > Math.min(p3.y, p4.y) && P.y < Math.max(p3.y, p4.y)) {
                return P;
            }
        }

        return false;
    }
}