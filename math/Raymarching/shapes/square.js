class Square extends Shape {
    constructor(x,y, s) {
        super(x,y);
        this.s = s;
    }

    GetDistance(x, y) {
        let dx = Math.max(Math.abs(x - this.x) - this.s.x / 2, 0);
        let dy = Math.max(Math.abs(y - this.y) - this.s.y / 2, 0);
        let dst = dx * dx + dy * dy;
        return dst < 1 ? -1 : dst;
    }
}