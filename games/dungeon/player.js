class Player {
    constructor(map) {
        this.speed = 2.5;
        this.dir = 0;
        this.fov = 60;
        this.map = map;

        this.pos = map.starting;
    }

    draw() {
        let lines = [];
        const amount = canvas.width;
        let halfFOV = this.fov * 0.5;

        let increment = this.fov / amount;
        for(let a = this.dir - halfFOV; a < this.dir + halfFOV; a+=increment) {
            let dir = getVector2FromAngle(a);
            dir.Scale(1000);

            let result = null;

            let record = Infinity;
            this.map.walls.forEach((wall) => {

                let collision = wall.hit(this.pos, dir.ReturnAdd(this.pos));

                if(collision !== false) {
                    let dist = getDistanceBetween(this.pos, collision);
                    if(dist < record) {
                        result = collision;
                        record = dist;
                    }
                }
            })

            //1° × π/180
            // * Math.cos(a * (Math.PI / 180)
            lines.push(record * Math.cos((this.dir - a) * (Math.PI / 180)));
        }

        //Draw ceiling
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2)

        //Draw floor
        ctx.fillStyle = "blue";
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2)

        for(let i = 0; i < lines.length; i++) {
            let max = canvas.height * 400;

            const dst = lines[i];
            const dstSQ = dst*dst;
            const w = canvas.width / lines.length;

            let color = (dimensions*dimensions * 25) / dst;
            ctx.fillStyle = `rgb(${color},${color},${color})`;
            let h = (dimensions*dimensions * canvas.height) / dst;
            let x = w * i;
            ctx.fillRect(x, (canvas.height / 2) - h/2, w, h);
        }
    }

    forward() {
        let dir = getVector2FromAngle(this.dir);
        dir.Scale(this.speed);
        this.move(dir);
    }

    left() {
        let dir = getVector2FromAngle(this.dir - 90);
        dir.Scale(this.speed / 1.5);
        this.move(dir);
    }

    right() {
        let dir = getVector2FromAngle(this.dir + 90);
        dir.Scale(this.speed / 1.5);
        this.move(dir);
    }

    backwards() {
        let dir = getVector2FromAngle(this.dir);
        dir.Scale(-this.speed/2);
        this.move(dir);
    }

    move(dir) {
        let nextPos = this.pos.ReturnAdd(dir.ReturnScaled(10));

        let inside = false;

        this.map.walls.forEach((wall) => {
            let result = wall.hit(this.pos, nextPos);
            if(result !== false) {
                inside = true;
            }
        })

        if(!inside) {
            this.pos.add(dir);
        }
    }
}