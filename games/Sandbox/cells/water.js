class Water {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = type.water;
        this.flammable = false;

        this.r = color[type.water][0]
        this.g = color[type.water][1]
        this.b = color[type.water][2]
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty && newWorld[this.x][this.y+1].type === type.empty ||world[this.x][this.y+1].type === type.oil && newWorld[this.x][this.y+1].type === type.oil) {
            SwapCell(this.x, this.y, new Vector2(0,1), 1)
        } else if(world[this.x - 1][this.y + 1].type === type.empty && newWorld[this.x - 1][this.y + 1].type === type.empty || world[this.x - 1][this.y + 1].type === type.oil && newWorld[this.x - 1][this.y + 1].type === type.oil) {
            SwapCell(this.x, this.y, new Vector2(-1,1), 1)
        } else if(world[this.x + 1][this.y + 1].type === type.empty && newWorld[this.x + 1][this.y + 1].type === type.empty || world[this.x + 1][this.y + 1].type === type.oil && newWorld[this.x + 1][this.y + 1].type === type.oil) {
            SwapCell(this.x, this.y, new Vector2(1,1), 1)
        } else if(world[this.x - 1][this.y].type === type.empty && newWorld[this.x-1][this.y].type === type.empty || world[this.x - 1][this.y].type === type.oil && newWorld[this.x-1][this.y].type === type.oil) {
            SwapCell(this.x, this.y, new Vector2(-1,0), 1)
        } else if(world[this.x + 1][this.y].type === type.empty && newWorld[this.x+1][this.y].type === type.empty || world[this.x + 1][this.y].type === type.oil && newWorld[this.x+1][this.y].type === type.oil) {
            SwapCell(this.x, this.y, new Vector2(1, 0), 1)
        }
    }
}