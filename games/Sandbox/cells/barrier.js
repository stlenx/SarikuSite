class Barrier {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = type.barrier;
        this.flammable = false;

        this.r = color[type.barrier][0]
        this.g = color[type.barrier][1]
        this.b = color[type.barrier][2]
    }

    Update() {

    }
}