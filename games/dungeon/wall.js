class Wall {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }

    hit(pos1, pos2) {
        //return this.intersects(pos1, pos2, this.pos, this.pos.ReturnAdd(this.dir));
        return this.segment_intersection(pos1.x, pos1.y, pos2.x, pos2.y, this.pos.x, this.pos.y, this.pos.ReturnAdd(this.dir).x, this.pos.ReturnAdd(this.dir).y);
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

        let wiggle = 1;
        if(P.x >= Math.min(p1.x, p2.x) - wiggle && P.x <= Math.max(p1.x, p2.x) + wiggle && P.y >= Math.min(p1.y, p2.y) - wiggle && P.y <= Math.max(p1.y, p2.y) + wiggle) {
            if(P.x >= Math.min(p3.x, p4.x) - wiggle && P.x <= Math.max(p3.x, p4.x) + wiggle && P.y >= Math.min(p3.y, p4.y) - wiggle && P.y <= Math.max(p3.y, p4.y) + wiggle) {
                return P;
            }
        }

        return false;
    }

    between(a, b, c) {
        let eps = 0.0000001;
        return a-eps <= b && b <= c+eps;
    }
    segment_intersection(x1,y1,x2,y2, x3,y3,x4,y4) {
        let x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
        let y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

        if (isNaN(x)||isNaN(y)) {
            return false;
        }

        if (x1>=x2) {
            if (!this.between(x2, x, x1)) return false;
        } else {
            if (!this.between(x1, x, x2)) return false;
        }

        if (y1>=y2) {
            if (!this.between(y2, y, y1)) return false;
        } else {
            if (!this.between(y1, y, y2)) return false;
        }

        if (x3>=x4) {
            if (!this.between(x4, x, x3)) return false;
        } else {
            if (!this.between(x3, x, x4)) return false;
        }

        if (y3>=y4) {
            if (!this.between(y4, y, y3)) return false;
        } else {
            if (!this.between(y3, y, y4)) return false;
        }

        return new Vector2(x, y);
    }
}