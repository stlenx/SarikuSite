class Universe {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.id = 0;
    }

    Draw() {
        ctx.clearRect(0,0, this.width, this.height)

        this.objects.forEach((e) => {
            e.Draw();
        })
    }

    UpdateObjects(d) {
        this.objects.forEach((e) => {
            if(e.ready) e.Update(d)
        })
    }

    CheckCollision = (a, b) => (this.GetRadius(a.mass) + this.GetRadius(b.mass)) > getDistanceBetween(a, b)

    MergeObjects(a, b) {
        let indexA = 0;
        let indexB = 0;
        for (let i = 0; i < this.objects.length; i++) {
            if(a.id === this.objects[i].id) indexA = i;
            if(b.id === this.objects[i].id) indexB = i;
        }

        if(a.mass > b.mass) {
            this.objects[indexA].mass += b.mass;
            this.objects[indexA].v.mult(new Vector2(0.5, 0.5))
            this.objects.splice(indexB, 1)
        } else {
            this.objects[indexB].mass += a.mass;
            this.objects[indexB].v.mult(new Vector2(0.5, 0.5))
            this.objects.splice(indexA, 1)
        }
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
        console.log(mass)
        return mass / 1000;
    }
}