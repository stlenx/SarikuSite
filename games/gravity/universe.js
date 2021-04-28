class Universe {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.objects = [];
        this.id = 0;
    }

    Draw() {
        Bctx.clearRect(0,0, this.width, this.height)

        this.objects.forEach((e) => {
            e.Draw();
        })
    }

    UpdateObjects(d) {
        for (let i1 = 0; i1 <  this.objects.length; i1++) {
            if(this.objects[i1].ready) this.objects[i1].Update(d);
            for (let i2 = 0; i2 < this.objects.length; i2++) {
                if(i1 !== i2) {
                    if(this.CheckCollision(this.objects[i1], this.objects[i2])) this.MergeObjects(i1, i2)
                }
            }
        }
    }

    CheckCollision = (a, b) => (this.GetRadius(a.mass) + this.GetRadius(b.mass)) > getDistanceBetween(a, b)

    MergeObjects(a, b) {
        let index;

        if(this.objects[a].planet && this.objects[b].planet) {
            if(this.objects[a].mass > this.objects[b].mass) {
                this.objects[a].mass += this.objects[b].mass;
                index = b;
            } else {
                this.objects[b].mass += this.objects[a].mass;
                index = a;
            }
        } else {
            index = this.objects[a].planet ? a : b;
        }

        this.objects.splice(index, 1)
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
        return mass / 100;
    }
}