class Universe {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.objects = [];
    }

    Draw() {
        ctx.clearRect(0,0, this.width, this.height)

        this.objects.forEach((e) => {
            e.Draw();
        })
    }

    UpdateObjects(d) {
        this.objects.forEach((e) => {
            e.Update(d)
        })
    }

    UpdateSize(width, height) {
        this.width = width;
        this.height = height;
    }

    GetGravity(a, b) {
        let r = getDistanceBetween(a, b);
        let G =  6.674 * Math.pow(10, -11);
        return G * ((a.mass * b.mass) / (r * r))
    }

    GetRadius(mass) {
        return mass / 1000;
    }
}