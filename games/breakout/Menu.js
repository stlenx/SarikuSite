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

    Draw() {
        if(!this.on) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,this.w,this.h);
            return;
        }

        //Draw open menu
        ctx.fillStyle = this.ocolor;
        ctx.fillRect(this.ox,this.oy,this.ow,this.oh);

        ctx.font = "40px Helvetica ";
        ctx.fillStyle = "black";
        ctx.fillText(this.text,this.ox + this.ow / 2, this.oy + 40);

        this.elements.forEach((element) => {
            element.Draw()
        })
    }
}