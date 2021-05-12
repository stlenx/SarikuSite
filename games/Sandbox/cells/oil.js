class Oil {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = type.oil;
        this.flammable = true;

        this.r = color[type.oil][0]
        this.g = color[type.oil][1]
        this.b = color[type.oil][2]
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty && newWorld[this.x][this.y+1].type === type.empty) {
            SwapCell(this.x, this.y, new Vector2(0,1), 1)
        } else if(world[this.x - 1][this.y + 1].type === type.empty && newWorld[this.x - 1][this.y + 1].type === type.empty) {
            SwapCell(this.x, this.y, new Vector2(-1,1), 1)
        } else if(world[this.x + 1][this.y + 1].type === type.empty && newWorld[this.x + 1][this.y + 1].type === type.empty) {
            SwapCell(this.x, this.y, new Vector2(1,1), 1)
        } else if(world[this.x - 1][this.y].type === type.empty && newWorld[this.x-1][this.y].type === type.empty) {
            SwapCell(this.x, this.y, new Vector2(-1,0), 1)
        } else if(world[this.x + 1][this.y].type === type.empty && newWorld[this.x+1][this.y].type === type.empty) {
            SwapCell(this.x, this.y, new Vector2(1, 0), 1)
        }
    }
}