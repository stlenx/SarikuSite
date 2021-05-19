class Path {
    constructor(a, b) {
        this.a = a;
        this.b = b;

        if(a.x > b.x) {
            this.Hash = Hash(`${a.x},${a.y},${b.x},${b.y}`)
        } else {
            this.Hash = Hash(`${b.x},${b.y},${a.x},${a.y}`)
        }
    }
}