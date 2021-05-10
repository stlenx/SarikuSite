class Cell {
    constructor(x, y, Gtype) {
        this.x = x;
        this.y = y;
        this.type = Gtype;
        switch (Gtype) {
            case type.empty:
                this.r = 0;
                this.g = 0;
                this.b = 0;
                break;
            case type.sand:
                this.r = 76;
                this.g = 70;
                this.b = 50;
                break;
            case type.water:
                this.r = 78;
                this.g = 141;
                this.b = 200;
                break;
        }
    }
}