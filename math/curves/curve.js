class Curve {
    constructor(points) {
        this.points = points;
        this.t = [];
    }

    Bezier(points, t) {
        if(points.length > 3) {
            let newPoints = [];

            for (let i = 0; i < points.length - 1; i++) {
                let posX = points[i].x + ((points[i+1].x - points[i].x) * t)
                let posY = points[i].y + ((points[i+1].y - points[i].y) * t)

                newPoints.push(new Vector2(posX, posY))

                ctx.strokeStyle = hslToHex(Remap(points.length, this.points.length, 1, 0, 360), 100, 50);
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

            let posX1 = points[0].x + ((points[1].x - points[0].x) * t)
            let posY1 = points[0].y + ((points[1].y - points[0].y) * t)

            let posX2 = points[1].x + ((points[2].x - points[1].x) * t)
            let posY2 = points[1].y + ((points[2].y - points[1].y) * t)

            ctx.beginPath()
            ctx.moveTo(posX1, posY1)
            ctx.lineTo(posX2, posY2)
            ctx.stroke()
            ctx.closePath()

            let posX3 = posX1 + ((posX2 - posX1) * t)
            let posY3 = posY1 + ((posY2 - posY1) * t)

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

        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.t[0].x, this.t[0].y);
        for (let i = 1; i < this.t.length; i++) {
            ctx.lineTo(this.t[i].x, this.t[i].y);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;
    }

}