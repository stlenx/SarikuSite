class Cell {
    constructor(x, y, Gtype) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.type = Gtype;

        this.r = color[Gtype][0]
        this.g = color[Gtype][1]
        this.b = color[Gtype][2]
    }
}