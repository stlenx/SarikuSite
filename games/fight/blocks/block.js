class Block {
    constructor(x, y, s, size) { //S stands for size and it's the resolution of the whole canvas
        this.x = x;
        this.y = y;
        this.s = s;
        this.size = size;
        this.posType = 0; //Just a block lol
        this.sprite = undefined;
    }

    Draw() {
        let size = this.s / this.size;
        ctx.drawImage(this.sprite, size * this.x, size * this.y, size, size);
    }
}