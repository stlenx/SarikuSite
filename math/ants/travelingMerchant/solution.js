class Solution {
    constructor() {
        this.distance = null;
        this.points = [];
    }

    set Path(points) {
        this.points = points
    }

    set AddDestination(destination) {
        this.points.push(destination)
    }

    CalcDst() {
        let dst = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            dst += getDistanceBetween(this.points[i], this.points[i+1])
        }
        this.distance = dst;
    }

    Draw() {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;
    }
}