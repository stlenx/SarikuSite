class Water extends Cell {
    constructor(x, y,random = Infinity) {
        super(x, y)
        this.type = type.water;
        this.flammable = false;

        let randomC = random === Infinity ? getRandom(-10, 10) : random;
        this.random = randomC

        this.r = color[type.water][0] + randomC
        this.g = color[type.water][1] + randomC
        this.b = color[type.water][2] + randomC
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty || world[this.x][this.y+1].type === type.oil) {
            SwapCell(this.x, this.y, new Vector2(0,1), 1)
        } else {
            if(Math.floor(getRandom(0,2)) === 0) {
                if(world[this.x - 1][this.y + 1].type === type.empty || world[this.x - 1][this.y + 1].type === type.oil) {
                    SwapCell(this.x, this.y, new Vector2(-1,1), 1)
                } else if(world[this.x + 1][this.y + 1].type === type.empty || world[this.x + 1][this.y + 1].type === type.oil) {
                    SwapCell(this.x, this.y, new Vector2(1,1), 1)
                } else {
                    if(Math.floor(getRandom(0,2)) === 0) {
                        if(world[this.x + 1][this.y].type === type.empty || world[this.x + 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(1,0), 1)
                        } else if(world[this.x - 1][this.y].type === type.empty || world[this.x - 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(-1, 0), 1)
                        }
                    } else {
                        if(world[this.x - 1][this.y].type === type.empty || world[this.x - 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(-1,0), 1)
                        } else if(world[this.x + 1][this.y].type === type.empty || world[this.x + 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(1, 0), 1)
                        }
                    }
                }
            } else {
                if(world[this.x + 1][this.y + 1].type === type.empty || world[this.x + 1][this.y + 1].type === type.oil) {
                    SwapCell(this.x, this.y, new Vector2(+1,1), 1)
                } else if(world[this.x - 1][this.y + 1].type === type.empty || world[this.x - 1][this.y + 1].type === type.oil) {
                    SwapCell(this.x, this.y, new Vector2(-1,1), 1)
                } else{
                    if(Math.floor(getRandom(0,2)) === 0) {
                        if(world[this.x + 1][this.y].type === type.empty || world[this.x + 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(1,0), 1)
                        } else if(world[this.x - 1][this.y].type === type.empty || world[this.x - 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(-1, 0), 1)
                        }
                    } else {
                        if(world[this.x - 1][this.y].type === type.empty || world[this.x - 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(-1,0), 1)
                        } else if(world[this.x + 1][this.y].type === type.empty || world[this.x + 1][this.y].type === type.oil) {
                            SwapCell(this.x, this.y, new Vector2(1, 0), 1)
                        }
                    }
                }
            }
        }
    }
}