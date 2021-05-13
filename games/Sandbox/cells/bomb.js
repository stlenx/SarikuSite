class Bomb {
    constructor(x, y, random = Infinity) {
        this.x = x;
        this.y = y;
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
        if(world[this.x][this.y+1].type === type.empty && newWorld[this.x][this.y+1].type === type.empty || world[this.x][this.y+1].type === type.water && newWorld[this.x][this.y+1].type === type.water) {
            SwapCell(this.x, this.y, new Vector2(0, 1), 1)
        } else if(world[this.x][this.y+1].type !== this.type && newWorld[this.x][this.y+1].type !== this.type) {
            this.Explode()
        }
    }

    Explode() {
        newWorld[this.x][this.y] = new Empty(this.x, this.y)
        newWorld[this.x + 1][this.y] = new Empty(this.x + 1, this.y)
        newWorld[this.x - 1][this.y] = new Empty(this.x - 1, this.y)
        newWorld[this.x][this.y + 1] = new Empty(this.x, this.y + 1)
        newWorld[this.x][this.y - 1] = new Empty(this.x, this.y - 1)

        let indices = []

        for (let x = 0; x < world.length; x++)
        {
            for (let y = 0; y < world.length; y++)
            {
                let dx = x - this.x;
                let dy = y - this.y;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared <= this.radius * this.radius)
                {
                    newWorld[x][y] = new Empty(x, y)
                }
            }
        }
    }
}