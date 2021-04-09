class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        let h = Math.sqrt((this.x * this.x) + (this.y * this.y))
        this.x /= h;
        this.y /= h;
    }
}