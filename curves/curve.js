class Curve {
    constructor(points) {
        this.points = points;
        this.t = [];
    }

    Calculate(increment) {
        this.t = [];
        for(let t = 0; t < 1; t+=increment) {
            //
//
            //let posX1 = Remap(t, 0, 1, this.p1.x, this.p2.x)
            //let posY1 = Remap(t, 0, 1, this.p1.y, this.p2.y)
//
            //let posX2 = Remap(t, 0, 1, this.p2.x, this.p3.x)
            //let posY2 = Remap(t, 0, 1, this.p2.y, this.p3.y)
//
            //let posX3 = Remap(t, 0, 1, posX1, posX2)
            //let posY3 = Remap(t, 0, 1, posY1, posY2)
//
            //this.t.push(new Vector2(posX3, posY3))
        }
    }

    Bezier(points, t) {
        if(points.length > 3) {
            let newPoints = [];

            for (let i = 0; i < points.length - 1; i++) {
                let posX = Remap(t, 0, 1, points[i].x, points[i+1].x)
                let posY = Remap(t, 0, 1, points[i].y, points[i+1].y)

                newPoints.push(new Vector2(posX, posY))

                ctx.strokeStyle = "red";
                ctx.beginPath()
                ctx.moveTo(points[i].x, points[i].y)
                ctx.lineTo(points[i+1].x, points[i+1].y)
                ctx.stroke()
                ctx.closePath()

                ctx.fillStyle = "blue";
                let circle = new Path2D()
                circle.arc(posX, posY, 5, 0, Math.PI*2);
                ctx.fill(circle);
            }

            this.Bezier(newPoints, t)
        } else {
            ctx.strokeStyle = "red";
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)
            ctx.lineTo(points[1].x, points[1].y)
            ctx.lineTo(points[2].x, points[2].y)
            ctx.stroke()
            ctx.closePath()

            let posX1 = Remap(t, 0, 1, points[0].x, points[1].x)
            let posY1 = Remap(t, 0, 1, points[0].y, points[1].y)

            let posX2 = Remap(t, 0, 1, points[1].x, points[2].x)
            let posY2 = Remap(t, 0, 1, points[1].y, points[2].y)

            ctx.beginPath()
            ctx.moveTo(posX1, posY1)
            ctx.lineTo(posX2, posY2)
            ctx.stroke()
            ctx.closePath()

            let posX3 = Remap(t, 0, 1, posX1, posX2)
            let posY3 = Remap(t, 0, 1, posY1, posY2)

            ctx.fillStyle = "blue";
            let circle = new Path2D()
            circle.arc(posX3, posY3, 5, 0, Math.PI*2);

            circle.arc(posX1, posY1, 5, 0, Math.PI*2);
            circle.arc(posX2, posY2, 5, 0, Math.PI*2);
            ctx.fill(circle);

            this.t.push(new Vector2(posX3, posY3))
        }
    }

    Draw(t) {
        this.Bezier(this.points, t)

        ctx.strokeStyle = "black";
        ctx.beginPath();
        for (let i = 0; i < this.t.length-1; i++) {
            ctx.moveTo(this.t[i].x, this.t[i].y);
            ctx.lineTo(this.t[i+1].x, this.t[i+1].y);
            ctx.stroke();
        }
        ctx.closePath();
    }

}