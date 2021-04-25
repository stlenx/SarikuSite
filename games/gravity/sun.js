class Sun {
    constructor(x, y, mass) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.color = "red";
        this.ready = false;
        this.planet = false;
        this.id = universe.id;
        universe.id++;
    }

    Draw() {
        ctx.fillStyle = this.color;
        let circle = new Path2D()
        circle.arc(this.x, this.y, 4, 0, Math.PI*2);
        ctx.fill(circle);
    }

    Update() {

    }

    InitObject(x, y) {
        this.ready = true;
        this.color = "yellow";
    }
}