class Nest {
    constructor(x, y, n) {
        this.x = x;
        this.y = y;
        this.radius = 50;
        this.food = 0;
        this.ants = [];
        for (let i = 0; i < n; i++) {
            let angle = getRandom(0, 6.28319);
            let x = this.x + Math.cos(angle) * this.radius;
            let y = this.y + Math.sin(angle) * this.radius;
            this.ants.push(new Ant(x, y, angle * 180 / Math.PI, 5))
        }
    }

    Move() {
        this.ants.forEach((a) => {
            a.Move()
        })
    }

    Draw() {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath()

        this.ants.forEach((a) => {
            a.Draw();
        })

        document.getElementById("food").innerHTML = this.food;
    }
}