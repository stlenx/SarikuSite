class Bomb extends Cell {
    constructor(x, y, random = Infinity) {
        super(x,y)

        this.type = type.bomb;
        this.flammable = true;
        this.burningChance = 0.5;
        this.radius = 10;

        let randomC = random === Infinity ? getRandom(-20, 20) : random;
        this.random = randomC;

        this.r = color[type.bomb][0] + randomC
        this.g = color[type.bomb][1] + randomC
        this.b = color[type.bomb][2] + randomC
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty|| world[this.x][this.y+1].type === type.water) {
            SwapCell(this.x, this.y, new Vector2(0, 1), 1)
        } else if(world[this.x - 1][this.y+1].type === type.fire) {
            this.Explode()
        } else if(world[this.x + 1][this.y+1].type === type.fire) {
            this.Explode()
        } else if(world[this.x + 1][this.y].type === type.fire) {
            this.Explode()
        } else if(world[this.x - 1][this.y].type === type.fire) {
            this.Explode()
        } else if(world[this.x + 1][this.y-1].type === type.fire) {
            this.Explode()
        } else if(world[this.x][this.y-1].type === type.fire) {
            this.Explode()
        } else if(world[this.x - 1][this.y-1].type === type.fire) {
            this.Explode()
        }
    }

    Explode() {
        for (let x = this.x - this.radius; x < this.x + this.radius; x++) {
            for (let y = this.y - this.radius; y < this.y + this.radius; y++) {
                let dx = x - this.x;
                let dy = y - this.y;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared <= this.radius * this.radius) {
                    if(x > 0 && x < world.length - 1 && y >= 0 && y < world[0].length) {
                        if(Math.floor(getRandom(0,2)) === 0) {
                            world[x][y] = new Empty(x, y)
                        } else {
                            world[x][y] = new Fire(x, y, 10, false)
                        }
                    }
                }
            }
        }
    }
}