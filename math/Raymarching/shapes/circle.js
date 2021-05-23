class Circle extends Shape {
    constructor(x, y, r) {
        super(x, y);
        this.r = r;
    }

    GetDistance(x, y) {
        let dst = getDistanceBetween(new Vector2(x, y), new Vector2(this.x, this.y))
        return dst - this.r;
    }
}