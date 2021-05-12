class Fire {
    constructor(x, y, lifespan, isBurning) {
        this.x = x;
        this.y = y;
        this.type = type.fire;
        this.lifespan = lifespan;
        this.isBurning = isBurning;

        this.r = color[type.fire][0]
        this.g = color[type.fire][1]
        this.b = color[type.fire][2]
    }

    Update() {
        this.lifespan-=1;
        if(this.lifespan < 0) newWorld[this.x][this.y] = new Empty(this.x, this.y)
    }
}