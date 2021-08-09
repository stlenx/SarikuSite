class Player {
    constructor(map) {
        this.speed = 10;
        this.dir = 0;
        this.fov = 60;
        this.renderDistance = 2000;
        this.map = map;

        this.pos = map.starting;

        this.rCanvas = document.createElement("canvas");
        this.context = this.rCanvas.getContext("2d");
        this.rCanvas.setAttribute("width", canvas.width * 0.3);
        this.rCanvas.setAttribute("height", canvas.height * 0.3);
        this.imageData = this.context.getImageData(0, 0, this.rCanvas.width, this.rCanvas.height);

        this.wallImage = new Image();
        this.wallImage.src = "img/drt.jpg";

        this.Gun = new Image();
        this.Gun.src = "img/gunRest.png";

        this.GunShoot = new Image();
        this.GunShoot.src = "img/gunShoot.png";

        this.shooted = false;
        this.shootCountdown = 0;
    }

    draw(dt) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        this.drawFloor()

        this.drawWalls()

        this.drawMap()

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

    drawFloor() {
        if(this.image === undefined) return;

        let WorldX = Remap(this.pos.x, 0, 1920, 0, 7.5);
        let WorldY = Remap(this.pos.y, 0, 1920, 0, 7.5);
        let WorldA = this.dir * (Math.PI / 180);

        let Near = 0.05;
        let Far = 0.5;
        let FovHalf = (this.fov / 2) * (Math.PI / 180);

        let FarX1 = WorldX + Math.cos(WorldA - FovHalf) * Far;
        let FarY1 = WorldY + Math.sin(WorldA - FovHalf) * Far;

        let FarX2 = WorldX + Math.cos(WorldA + FovHalf) * Far;
        let FarY2 = WorldY + Math.sin(WorldA + FovHalf) * Far;

        let NearX1 = WorldX + Math.cos(WorldA - FovHalf) * Near;
        let NearY1 = WorldY + Math.sin(WorldA - FovHalf) * Near;

        let NearX2 = WorldX + Math.cos(WorldA + FovHalf) * Near;
        let NearY2 = WorldY + Math.sin(WorldA + FovHalf) * Near;


        let buf = new ArrayBuffer(this.imageData.data.length);
        let buf8 = new Uint8ClampedArray(buf);
        let data = new Uint32Array(buf);

        let halfHeight = this.rCanvas.height * 0.5;
        let start = Math.floor(Remap(this.renderDistance, 0, 2500, halfHeight, 0));

        for (let y = start; y < halfHeight; y++) {
            let SampleDepth = y / this.rCanvas.height / 2;

            let StartX = (FarX1 - NearX1) / (SampleDepth) + NearX1;
            let StartY = (FarY1 - NearY1) / (SampleDepth) + NearY1;

            let EndX = (FarX2 - NearX2) / (SampleDepth) + NearX2;
            let EndY = (FarY2 - NearY2) / (SampleDepth) + NearY2;

            for(let x = 0; x < this.rCanvas.width; x++) {
                let SampleWidth = x / this.rCanvas.width;

                let SampleX = (EndX - StartX) * SampleWidth + StartX;
                let SampleY = (EndY - StartY) * SampleWidth + StartY;

                SampleX = SampleX % 1;
                SampleY = SampleY % 1;

                let index = (Math.floor(SampleY * img.height) + Math.floor(SampleX * img.width) * this.image.width) * 4;

                data[y * this.imageData.width + x] =
                    (255   << 24) |	// alpha
                    (this.image.data[index+2] << 16) |	// blue
                    (this.image.data[index+1] <<  8) |	// green
                    this.image.data[index];		// red;
            }
        }

        this.imageData.data.set(buf8);
        this.context.putImageData(this.imageData, 0, 0);

        ctx.drawImage(this.rCanvas, 0, canvas.height / 2, canvas.width, canvas.height);

        let gradient = ctx.createLinearGradient(0,canvas.height / 2, 0,canvas.height);

        gradient.addColorStop(Remap(this.renderDistance, 0, 2500, 1, 0), "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    }

    drawWalls() {
        let viewDistance = this.renderDistance;

        let lines = [];
        let wall = [];
        const amount = canvas.width / 6;
        let halfFOV = this.fov * 0.5;

        //console.time('calculate')

        let increment = this.fov / amount;
        for(let a = this.dir - halfFOV; a < this.dir + halfFOV; a+=increment) {
            let dir = getVector2FromAngle(a);
            dir.Scale(viewDistance);

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

        //console.time('draw-calculated')

        for(let i = 0; i < lines.length; i++) {
            let imageWidth = this.wallImage.width - 1;

            const dst = lines[i];
            const w = canvas.width / lines.length;

            let color = Remap(dst, 0, viewDistance, 0, 1);
            ctx.fillStyle = `rgba(0,0,0,${color})`;
            let h = (dimensions*dimensions * canvas.height) / dst;
            let x = w * i;
            let y = (canvas.height / 2) - h/2;

            let section = wall[i] - Math.floor(wall[i]);
            let ix = imageWidth * section;

            ctx.drawImage(this.wallImage, ix, 0, 1, this.wallImage.height, x, y, w, h);
            h+=2;
            ctx.fillRect(x, (canvas.height / 2) - h/2, w, h);
        }
    }

    drawMap() {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0, canvas.height * 0.3, canvas.height * 0.3)

        let size = canvas.height * 0.29;
        let o = 2.5;
        let upscale = size / dimensions;

        //Draw current sqare
        let x = Math.floor((this.pos.x + 100) / this.map.wallWidth);
        let y = Math.floor((this.pos.y + 100) / this.map.wallWidth);

        ctx.fillStyle = "red";
        ctx.fillRect(x * upscale + o, y * upscale + o, size / 20, size / 20);

        //Draw walls
        for(let x = 0; x < dimensions; x++) {
            for(let y = 0; y < dimensions; y++) {
                if(this.map.map[x][y] === 1) {
                    ctx.fillStyle = "green";
                    ctx.fillRect(x * upscale + o, y * upscale + o, size / 20, size / 20);
                }
            }
        }

        //Drawing separating lines
        ctx.beginPath();
            for(let x = 0; x < dimensions+1; x++) {
            let px = x * upscale + o;
            ctx.moveTo(px, o);
            ctx.lineTo(px, size + o);
        }
            for(let y = 0; y < dimensions+1; y++) {
            let py = y * upscale;
            ctx.moveTo(o, py + o);
            ctx.lineTo(size + o, py + o);
        }
        ctx.stroke();
        ctx.closePath();

        x = ((this.pos.x + 100) / this.map.wallWidth) * upscale + o;
        y = ((this.pos.y + 100) / this.map.wallWidth) * upscale + o;
        StrokeCircle(new Vector2(x, y), 3);
    }

    shoot() {
        this.shooted = true;
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

        //this.pos.add(dir);
    }
}