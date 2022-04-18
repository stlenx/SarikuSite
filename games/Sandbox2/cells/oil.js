class Oil extends Cell {
    constructor(x, y, random = Infinity) {
        super(x,y)
        this.type = type.oil;
        this.flammable = true;
        this.burningChance = 0.9;

        let randomC = random === Infinity ? getRandom(-10, 10) : random;
        this.random = randomC

        this.r = color[type.oil][0] + randomC
        this.g = color[type.oil][1] + randomC
        this.b = color[type.oil][2] + randomC
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty) {
            SwapCell(this.x, this.y, new Vector2(0,1), 1)
        } else {
            if(Math.floor(getRandom(0,2)) === 0) {
                if(world[this.x - 1][this.y + 1].type === type.empty) {
                    SwapCell(this.x, this.y, new Vector2(-1,1), 1)
                } else if(world[this.x + 1][this.y + 1].type === type.empty) {
                    SwapCell(this.x, this.y, new Vector2(1,1), 1)
                } else {
                    if(Math.floor(getRandom(0,2)) === 0) {
                        if(world[this.x + 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(1,0), 1)
                        } else if(world[this.x - 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(-1, 0), 1)
                        }
                    } else {
                        if(world[this.x - 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(-1,0), 1)
                        } else if(world[this.x + 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(1, 0), 1)
                        }
                    }
                }
            } else {
                if(world[this.x + 1][this.y + 1].type === type.empty) {
                    SwapCell(this.x, this.y, new Vector2(+1,1), 1)
                } else if(world[this.x - 1][this.y + 1].type === type.empty) {
                    SwapCell(this.x, this.y, new Vector2(-1,1), 1)
                } else {
                    if(Math.floor(getRandom(0,2)) === 0) {
                        if(world[this.x + 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(1,0), 1)
                        } else if(world[this.x - 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(-1, 0), 1)
                        }
                    } else {
                        if(world[this.x - 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(-1,0), 1)
                        } else if(world[this.x + 1][this.y].type === type.empty) {
                            SwapCell(this.x, this.y, new Vector2(1, 0), 1)
                        }
                    }
                }
            }
        }
    }
}