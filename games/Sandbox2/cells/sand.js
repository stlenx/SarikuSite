class Sand extends Cell {
    constructor(x, y, random = Infinity) {
        super(x,y)
        this.type = type.sand;
        this.flammable = false;

        let randomC = random === Infinity ? getRandom(-10, 10) : random;
        this.random = randomC

        this.r = color[type.sand][0] + randomC
        this.g = color[type.sand][1] + randomC
        this.b = color[type.sand][2] + randomC
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty || world[this.x][this.y+1].type === type.water) {
            SwapCell(this.x, this.y, new Vector2(0, 1), 1)
        } else {
            if(Math.floor(getRandom(0,2)) === 0) {
                if(world[this.x - 1][this.y + 1].type === type.empty || world[this.x - 1][this.y + 1].type === type.water) {
                    SwapCell(this.x, this.y, new Vector2(-1, 1), 1)
                } else if(world[this.x + 1][this.y + 1].type === type.empty || world[this.x + 1][this.y + 1].type === type.water) {
                    SwapCell(this.x, this.y, new Vector2(1, 1), 1)
                }
            } else {
                if(world[this.x + 1][this.y + 1].type === type.empty || world[this.x + 1][this.y + 1].type === type.water) {
                    SwapCell(this.x, this.y, new Vector2(1, 1), 1)
                } else if(world[this.x - 1][this.y + 1].type === type.empty || world[this.x - 1][this.y + 1].type === type.water) {
                    SwapCell(this.x, this.y, new Vector2(-1, 1), 1)
                }
            }
        }
    }
}