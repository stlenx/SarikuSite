class Object {
    constructor(x, y, z, w, h, d) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.d = d;

        this.vertices = [];
        this.vertices.push(new Vector3(this.x - this.w / 2, this.y + this.h / 2, this.z - this.d / 2))
        this.vertices.push(new Vector3(this.x + this.w / 2, this.y + this.h / 2, this.z - this.d / 2))
        this.vertices.push(new Vector3(this.x - this.w / 2, this.y - this.h / 2, this.z - this.d / 2))
        this.vertices.push(new Vector3(this.x + this.w / 2, this.y - this.h / 2, this.z - this.d / 2))

        this.vertices.push(new Vector3(this.x - this.w / 2, this.y + this.h / 2, this.z + this.d / 2))
        this.vertices.push(new Vector3(this.x + this.w / 2, this.y + this.h / 2, this.z + this.d / 2))
        this.vertices.push(new Vector3(this.x - this.w / 2, this.y - this.h / 2, this.z + this.d / 2))
        this.vertices.push(new Vector3(this.x + this.w / 2, this.y - this.h / 2, this.z + this.d / 2))

        console.log(this.vertices)
    }
}