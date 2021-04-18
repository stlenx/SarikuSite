class Menu {
    constructor(x, y, w, h, color, ocolor, text, ox, oy, ow, oh) {
        this.on = false;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.ocolor = ocolor;
        this.text = text;
        this.ox = ox;
        this.oy = oy;
        this.ow = ow;
        this.oh = oh;
        this.elements = [];
    }

    AddElement(element) {
        this.elements.push(element)
    }
}