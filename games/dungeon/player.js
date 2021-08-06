class Player {
    constructor(pos, walls) {
        this.pos = pos;
        this.speed = 2.5;
        this.dir = 0;
        this.fov = 45;
        this.walls = walls;
    }

    draw() {
        let halfFOV = this.fov * 0.5;
        for(let a = this.dir - halfFOV; a < this.dir + halfFOV; a++) {
            let dir = getVector2FromAngle(a);
            dir.Scale(1000);

            let result = null;

            let record = Infinity;
            this.walls.forEach((wall) => {

                let collision = wall.hit(this.pos, dir.ReturnAdd(this.pos));

                if(collision !== false) {
                    let dist = getDistanceBetween(this.pos, collision);
                    if(dist < record) {
                        result = collision;
                        record = dist;
                    }
                }
            })

            if(result !== null) {
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(result.x, result.y);
                ctx.stroke();
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(this.pos.x + dir.x, this.pos.y + dir.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    forward() {
        let dir = getVector2FromAngle(this.dir);
        dir.Scale(this.speed);
        this.move(dir);
    }

    backwards() {
        let dir = getVector2FromAngle(this.dir);
        dir.Scale(-this.speed/2);
        this.move(dir);
    }

    move(dir) {
        let nextPos = this.pos.ReturnAdd(dir);

        let inside = false;

        this.walls.forEach((wall) => {
            let wallPos = wall.pos.ReturnAdd(wall.dir);

            let height, width, topLeft;
            if(wall.dir.x < 1) { //Vertical line
                height = 50;

                topLeft = new Vector2(Math.min(wall.x, wallPos.x), Math.min(wall.y, wallPos.y));
                topLeft.y -= height / 2;
                width = getDistanceBetween(wall.pos, wallPos);

            } else { //Horizontal line
                width = 50;

                topLeft = new Vector2(wall.x, Math.min(wall.y, wallPos.y));
                topLeft.x -= width / 2;
                height = getDistanceBetween(wall.pos, wallPos);
            }

            let thicc = 20;

            let pos = new Vector2(nextPos.x - thicc / 2, nextPos.y - thicc / 2);

            if (pos.x < topLeft.x + width &&
                pos.x + thicc > topLeft.x &&
                pos.y < topLeft.y + height &&
                pos.y + thicc > topLeft.y) {

                inside = true;

                console.log("hello")
            }
        })

        if(!inside) {
            this.pos = nextPos;
        }
    }
}