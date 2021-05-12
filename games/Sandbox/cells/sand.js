class Sand {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = type.sand;

        this.r = color[type.sand][0]
        this.g = color[type.sand][1]
        this.b = color[type.sand][2]
    }

    Update() {
        if(world[this.x][this.y+1].type === type.empty && newWorld[this.x][this.y+1].type === type.empty || world[this.x][this.y+1].type === type.water && newWorld[this.x][this.y+1].type === type.water) {
            SwapCell(this.x, this.y, new Vector2(0, 1), 1)
        } else if(world[this.x - 1][this.y + 1].type === type.empty && newWorld[this.x - 1][this.y+1].type === type.empty || world[this.x - 1][this.y + 1].type === type.water && newWorld[this.x - 1][this.y+1].type === type.water) {
            SwapCell(this.x, this.y, new Vector2(-1, 1), 1)
        } else if(world[this.x + 1][this.y + 1].type === type.empty && newWorld[this.x + 1][this.y+1].type === type.empty || world[this.x + 1][this.y + 1].type === type.water && newWorld[this.x + 1][this.y+1].type === type.water) {
            SwapCell(this.x, this.y, new Vector2(1, 1), 1)
        }
    }
}