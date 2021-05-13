class Fire {
    constructor(x, y,lifespan, isBurning) {
        this.x = x;
        this.y = y;
        this.type = type.fire;
        this.lifespan = lifespan;
        this.isBurning = isBurning;
        this.flammable = false;

        let randomC = getRandom(-10, 10);

        this.r = color[type.fire][0] + randomC
        this.g = color[type.fire][1] + randomC
        this.b = color[type.fire][2] + randomC

        this.directions = [
            new Vector2(1, 1),
            new Vector2(0, 1),
            new Vector2(-1, 1),
            new Vector2(1, 0),
            new Vector2(0, 0),
            new Vector2(-1, 0),
            new Vector2(1, -1),
            new Vector2(0, -1),
            new Vector2(-1, -1),
        ]
    }

    Update() {
        this.lifespan-=1;
        if(this.lifespan < 0) {
            newWorld[this.x][this.y] = new Empty(this.x, this.y)
        } else {
            newWorld[this.x][this.y] = new Fire(this.x, this.y, this.lifespan, this.isBurning)
        }

        this.CheckDirections(this.directions)

        //if(world[this.x][this.y+1].flammable) {
        //    this.MightBurn(this.x, this.y+1)
        //} else if(world[this.x - 1][this.y + 1].flammable) {
        //    this.MightBurn(this.x-1, this.y+1)
        //} else if(world[this.x + 1][this.y + 1].flammable) {
        //    this.MightBurn(this.x+1, this.y+1)
        //} else if(world[this.x - 1][this.y].flammable) {
        //    this.MightBurn(this.x - 1, this.y)
        //} else if(world[this.x + 1][this.y].flammable) {
        //    this.MightBurn(this.x + 1, this.y)
        //} else if(world[this.x][this.y - 1].flammable) {
        //    this.MightBurn(this.x, this.y-1)
        //} else if(world[this.x - 1][this.y - 1].flammable) {
        //    this.MightBurn(this.x-1, this.y-1)
        //} else if(world[this.x + 1][this.y - 1].flammable) {
        //    this.MightBurn(this.x+1, this.y-1)
        //}
    }

    CheckDirections(directions) {
        if(directions.length > 1) {
            let pos = Math.floor(getRandom(0, directions.length))

            if(world[this.x + directions[pos].x][this.y + directions[pos].y].flammable) {
                this.MightBurn(this.x + directions[pos].x, this.y + directions[pos].y)
            } else {
                directions.splice(pos, 1)

                this.CheckDirections(directions)
            }
        } else {
            if(world[this.x + directions[0].x][this.y + directions[0].y].flammable) {
                this.MightBurn(this.x + directions[0].x, this.y + directions[0].y)
            }
        }
    }

    MightBurn(x,y) {
        if(getRandom(0, 10) < world[x][y].burningChance * 10) {
            newWorld[x][y] = new Fire(x, y,10, true)
        }
    }
}