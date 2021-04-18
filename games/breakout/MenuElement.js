class MenuElement {
    constructor(id, x, y, w, h, color, text, textSize, tx, ty, value = 0) {
        this.id = id;
        this.value = value;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.text = text;
        this.textSize = textSize;
        this.tx = tx;
        this.ty = ty;
    }
}