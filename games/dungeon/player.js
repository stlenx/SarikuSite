class Player {
    constructor(map) {
        this.speed = 2.5;
        this.dir = 0;
        this.fov = 60;
        this.map = map;

        this.pos = map.starting;

        this.wallImage = new Image();
        this.wallImage.src = "img/wall.png";
    }

    draw() {
        let lines = [];
        let wall = [];
        const amount = canvas.width;
        let halfFOV = this.fov * 0.5;

        let increment = this.fov / amount;
        for(let a = this.dir - halfFOV; a < this.dir + halfFOV; a+=increment) {
            let dir = getVector2FromAngle(a);
            dir.Scale(1000);

            let result = null;

            let record = Infinity;
            let recordIndex = null;

            for(let i = 0; i < this.map.walls.length; i++) {
                let wall = this.map.walls[i];

                let collision = wall.hit(this.pos, dir.ReturnAdd(this.pos));

                if(collision !== false) {
                    let dist = getDistanceBetween(this.pos, collision);
                    if(dist < record) {
                        result = collision;
                        record = dist;

                        //Thing for texture mapping
                        if(wall.dir.x >= this.map.wallWidth) { //Horizontal
                            recordIndex = Remap(collision.x, wall.pos.x, wall.pos.x + this.map.wallWidth, 0, 1);
                        } else { //Vertical
                            recordIndex = Remap(collision.y, wall.pos.y, wall.pos.y + this.map.wallWidth, 0, 1);
                        }
                    }
                }
            }

            lines.push(record * Math.cos((this.dir - a) * (Math.PI / 180)));
            wall.push(recordIndex);
        }

        //Draw ceiling
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2)

        //Draw floor
        ctx.fillStyle = "blue";
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2)

        for(let i = 0; i < lines.length; i++) {
            const dst = lines[i];
            const w = canvas.width / lines.length;

            let color = Remap(dst, 0, canvas.height, 0, 1);
            ctx.fillStyle = `rgba(0,0,0,${color})`;
            let h = (dimensions*dimensions * canvas.height) / dst;
            let x = w * i;
            let y = (canvas.height / 2) - h/2;

            let section = wall[i] - Math.floor(wall[i]);

            ctx.drawImage(this.wallImage, this.wallImage.width * section, 0, 1, this.wallImage.height, x, y, w, h);
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
        this.pos.add(dir);
    }
}