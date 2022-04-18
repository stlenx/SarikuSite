class Player {
    constructor(map, shadows) {
        this.speed = 5;
        this.dir = 0;
        this.fov = 60;
        this.renderDistance = 2000;
        this.map = map;
        this.shadows = shadows;

        this.pos = map.starting;

        this.shooted = false;
        this.shootCountdown = 0;
    }

    draw(dt) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //this.drawFloor()

        this.DrawWalls()

        //this.drawSprites()

        //this.drawMap()

        //Draw gun
        let h = this.GunShoot.height * canvas.height * 0.005;
        let w = this.GunShoot.width * canvas.height * 0.005;
        if(this.shooted) {
            ctx.drawImage(this.GunShoot, canvas.width - w, canvas.height - h, w, h)
        } else {
            ctx.drawImage(this.Gun, canvas.width - w, canvas.height - h, w, h)
        }

        if(this.shootCountdown > 500) {
            this.shooted = false;
            this.shootCountdown = 0;
        } else {
            this.shootCountdown += dt;
        }
    }

    drawSprites() {
        let halfFOV = this.fov * .85;

        let vector = getVector2(this.pos, this.map.ending);
        let dir = Math.atan2(vector.x, vector.y) * -(180 / Math.PI) + 90;

        if(dir > this.dir - halfFOV && dir < this.dir + halfFOV) { //Looking at karo
            console.log(true)
            ctx.drawImage(this.enemy, Remap(dir, this.dir-halfFOV, this.dir + halfFOV, 0, canvas.width), 0, this.enemy.width, this.enemy.height)
        }
    }

    DrawFloor() {

    }

    DrawWalls() {

    }

    DrawMap() {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.height * 0.3, canvas.height * 0.3)

        let size = canvas.height * 0.3;
        let upscale = size / dimensions;

        //Draw current sqare
        let x = Math.floor((this.pos.x + 100) / this.map.wallWidth);
        let y = Math.floor((this.pos.y + 100) / this.map.wallWidth);

        ctx.fillStyle = "rgb(255,117,117)";
        ctx.fillRect(x * upscale, y * upscale, size / 20, size / 20);

        //Draw karo
        x = Math.floor((this.map.ending.x + 100) / this.map.wallWidth);
        y = Math.floor((this.map.ending.y + 100) / this.map.wallWidth);

        ctx.fillStyle = "yellow";
        ctx.fillRect(x * upscale, y * upscale, size / 20, size / 20);

        //Draw walls
        for(let x = 0; x < dimensions; x++) {
            for(let y = 0; y < dimensions; y++) {
                if(this.map.map[x][y] === 1) {
                    ctx.fillStyle = "green";
                    ctx.fillRect(x * upscale, y * upscale, size / 20, size / 20);
                }
            }
        }

        //Drawing separating lines
        ctx.beginPath();
            for(let x = 0; x < dimensions+1; x++) {
            let px = x * upscale;
            ctx.moveTo(px, 0);
            ctx.lineTo(px, size);
        }
            for(let y = 0; y < dimensions+1; y++) {
            let py = y * upscale;
            ctx.moveTo(0, py);
            ctx.lineTo(size, py);
        }
        ctx.stroke();
        ctx.closePath();

        x = ((this.pos.x + 100) / this.map.wallWidth) * upscale;
        y = ((this.pos.y + 100) / this.map.wallWidth) * upscale;
        StrokeCircle(new Vector2(x, y), 3);

        //Draw FOV
        let dst = 200;
        let halfFOV = this.fov * .5;
        let left = getVector2FromAngle(this.dir - halfFOV);
        let right = getVector2FromAngle(this.dir + halfFOV);
        left.Scale(dst);
        right.Scale(dst);

        StrokeLine(new Vector2(x, y), new Vector2(x + left.x, y + left.y));
        StrokeLine(new Vector2(x, y), new Vector2(x + right.x, y + right.y));
    }

    shoot() {
        this.shooted = true;
    }

    forward(dt) {
        let dir = getVector2FromAngle(this.dir);
        dir.Scale(this.speed * (16/dt));
        this.move(dir);
    }

    left(dt) {
        let dir = getVector2FromAngle(this.dir - 90);
        dir.Scale(this.speed / 1.5 * (16/dt));
        this.move(dir);
    }

    right(dt) {
        let dir = getVector2FromAngle(this.dir + 90);
        dir.Scale(this.speed / 1.5 * (16/dt));
        this.move(dir);
    }

    backwards(dt) {
        let dir = getVector2FromAngle(this.dir);
        dir.Scale(-this.speed/2 * (16/dt));
        this.move(dir);
    }

    move(dir) {
        let x = Math.floor((this.pos.x + this.map.wallWidth / 2) / this.map.wallWidth);
        let y = Math.floor((this.pos.y + this.map.wallWidth / 2) / this.map.wallWidth);

        let nx = Math.floor((this.pos.x + dir.x + this.map.wallWidth / 2) / this.map.wallWidth);
        let ny = Math.floor((this.pos.y + dir.y + this.map.wallWidth / 2) / this.map.wallWidth);

        if(this.map.map[nx][y] === 0) {
            this.pos.x += dir.x;
        }

        if(this.map.map[x][ny] === 0) {
            this.pos.y += dir.y;
        }
    }
}