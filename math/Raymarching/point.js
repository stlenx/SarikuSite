class Point{
    constructor(p,angle, objects, depth) {
        this.p = p;
        this.angle = angle;
        this.child = null;
        this.objects = objects;
        this.depth = depth;
    }

    Draw() {
        let lowest = Infinity;
        this.objects.forEach((c) => {
            let distance = signedDstToCircle(this.p, c.p, c.r);
            lowest = distance < lowest ? distance : lowest;
        })

        if(lowest < 1) {
            points.push(getDistanceBetween(point.p, this.p))
            return;
        }

        ctx.strokeStyle = "red";
        let circle = new Path2D()
        circle.arc(this.p.x, this.p.y, lowest, 0, Math.PI*2);
        ctx.stroke(circle);

        let x2 = this.p.x + Math.cos(Math.PI * this.angle / 180) * lowest;
        let y2 = this.p.y + Math.sin(Math.PI * this.angle / 180) * lowest;

        ctx.beginPath()
        ctx.moveTo(this.p.x, this.p.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath()

        if(this.depth > 0 && this.p.x > 0 && this.p.x < canvas.width && this.p.y > 0 && this.p.y < canvas.height) {
            this.child = new Point(new Vector2(x2, y2), this.angle, this.objects, this.depth - 1)
            this.child.Draw()
        } else {
            points.push(null)
        }
    }
}