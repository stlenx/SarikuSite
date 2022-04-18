class Fire extends Cell {
    constructor(x, y,lifespan, isBurning) {
        super(x,y)
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
            world[this.x][this.y] = new Empty(this.x, this.y)
        } else {
            world[this.x][this.y] = new Fire(this.x, this.y, this.lifespan, this.isBurning)
        }

        this.CheckDirections(this.directions)
    }

    CheckDirections(directions) {
        if(directions.length > 1) {
            let pos = Math.floor(getRandom(0, directions.length))

            if(this.y + directions[pos].y < 0) {
                if(world[this.x + directions[pos].x][world[0].length - 1].flammable) {
                    this.MightBurn(this.x + directions[pos].x, world[0].length - 1)
                } else {
                    directions.splice(pos, 1)

                    this.CheckDirections(directions)
                }
            } else {
                if(this.y + directions[pos].y > world.length - 1) {
                    if(world[this.x + directions[pos].x][0].flammable) {
                        this.MightBurn(this.x + directions[pos].x, 0)
                    } else {
                        directions.splice(pos, 1)

                        this.CheckDirections(directions)
                    }
                } else {
                    if(world[this.x + directions[pos].x][this.y + directions[pos].y].flammable) {
                        this.MightBurn(this.x + directions[pos].x, this.y + directions[pos].y)
                    } else {
                        directions.splice(pos, 1)

                        this.CheckDirections(directions)
                    }
                }
            }
        } else {
            if(this.y + directions[0].y < 0) {
                if(world[this.x + directions[0].x][world[0].length - 1].flammable) {
                    this.MightBurn(this.x + directions[0].x, world[0].length - 1)
                }
            } else {
                if(world[this.x + directions[0].x][this.y + directions[0].y].flammable) {
                    this.MightBurn(this.x + directions[0].x, this.y + directions[0].y)
                }
            }
        }
    }

    MightBurn(x,y) {
        if(getRandom(0, 10) < world[x][y].burningChance * 10) {
            world[x][y] = new Fire(x, y,10, true)
        }
    }
}