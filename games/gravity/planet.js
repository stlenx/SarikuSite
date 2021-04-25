class Planet {
    constructor(x, y, mx, my, mass) {
        this.x = x;
        this.y = y;
        this.mx = mx;
        this.my = my;
        this.mass = mass;
        this.ready = false;
        this.planet = true;
        this.v = new Vector2(0,0)
        this.color = "red";
        this.t = [];
        this.id = universe.id;
        universe.id++;
    }

    Draw() {
        if(!this.ready) {
            ctx.strokeStyle = 'rgb(150,150,150)'
            ctx.lineWidth = 0.8;
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.mx, this.my)
            ctx.stroke()
            ctx.closePath()
        }

        ctx.strokeStyle = 'rgba(150,150,150,255)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let i = 0; i < this.t.length -1; i++) {
            ctx.moveTo(this.t[i].x, this.t[i].y);
            ctx.lineTo(this.t[i+1].x, this.t[i+1].y);
            ctx.stroke();
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        let circle = new Path2D()
        circle.arc(this.x, this.y, universe.GetRadius(this.mass), 0, Math.PI*2);
        ctx.fill(circle);
    }

    Update(d) {
        this.x += this.v.x * (d / 16);
        this.y += this.v.y * (d / 16);

        while(this.t.length > maxTrail) this.t.splice(0,1)
        this.t.push(new Vector2(this.x, this.y))

        let radius = universe.GetRadius(this.mass)
        if(this.x + radius > universe.width && this.v.x > 0) this.v.x *= -1
        if(this.x + radius < 0 && this.v.x < 0) this.v.x *= -1
        if(this.y + radius < 0 && this.v.y < 0) this.v.y *= -1
        if(this.y + radius > universe.height && this.v.y > 0) this.v.y *= -1;

        universe.objects.forEach((e) => {
            if(e !== this && e.ready) {
                this.AddGravity(e)
            }
        })
    }

    AddGravity(e) {
        let force = universe.GetGravity(this, e);
        let direction = getVector2(this, e)

        direction.normalize()
        direction.mult(new Vector2(force * 1000000, force * 1000000))
        this.v.add(direction)
    }

    InitObject(x, y) {
        let vector = getVector2(new Vector2(x,y), new Vector2(this.x, this.y));
        this.v = new Vector2(vector.x / 10, vector.y / 10)
        this.ready = true;
        this.color = "blue";
        this.t = [];
    }

    Predict() {
        this.t = [];
        let fakeP = new Planet(this.x, this.y, this.mx, this.my, this.mass);
        fakeP.InitObject(this.mx, this.my)
        for(let t = 0; t < maxPrediction; t++) {
            fakeP.Update(16)
            this.t.push(fakeP.t[fakeP.t.length -1 ])
        }
    }
}