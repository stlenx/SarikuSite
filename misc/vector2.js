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

    mult(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }
}

function getVector2(a, b) {
    return new Vector2(b.x - a.x, b.y - a.y)
}

function getDistanceBetween(a, b) {
    return Math.sqrt( ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)) )
}