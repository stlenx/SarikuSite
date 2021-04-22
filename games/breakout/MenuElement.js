class MenuElement {
    type;

    constructor(id, x, y, w, h, color, text, textSize, tx, ty, type, value = 0) {
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
        this.type = type;
    }

    Draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(menu.ox + this.x,menu.oy + this.y,this.w,this.h);

        let plays = 1;
        switch (this.id) {
            case "plays":
                let data = JSON.parse(localStorage.getItem('saveData'));
                if (data !== null) plays = data.plays;
                this.text = `Times played: ${plays}`;
                break;
            case "volume":
                ctx.fillStyle = "rgb(71,71,71)";
                ctx.fillRect(menu.ox + this.x + width * 0.18,menu.oy + this.y + this.h / 2 - 2,this.w - width * 0.21,4);

                let pos = (this.w - width * 0.21) * volume;
                ctx.fillStyle = "rgb(0,180,255)";
                ctx.fillRect(menu.ox + this.x + width * 0.18,menu.oy + this.y + this.h / 2 - 2,pos,4);

                ctx.fillStyle = "rgb(170,170,170)";
                let volumeCircle = new Path2D()
                volumeCircle.arc(menu.ox + this.x + width * 0.18 + pos, menu.oy + this.y + this.h / 2, 10, 0, Math.PI*2)
                ctx.fill(volumeCircle);

                ctx.fillStyle = "rgb(208,208,208)";
                volumeCircle = new Path2D()
                volumeCircle.arc(menu.ox + this.x + width * 0.18 + pos, menu.oy + this.y + this.h / 2, 8, 0, Math.PI*2);
                ctx.fill(volumeCircle);
                break;
            case "hardMode":
                let hardCircleL = new Path2D()
                hardCircleL.arc(this.x + menu.ox,this.y + menu.oy + this.h / 2,this.h / 2,0,Math.PI * 2)

                let hardCircleR = new Path2D()
                hardCircleR.arc(this.x + menu.ox + this.w, this.y + menu.oy + this.h / 2, this.h / 2, 0, Math.PI * 2)

                if(this.value) {
                    this.color = "rgba(0,180,255,1)";

                    ctx.fillStyle = "rgb(0,180,255)";
                    ctx.fill(hardCircleL)

                    ctx.fillStyle = "rgb(208,208,208)";
                    ctx.fill(hardCircleR)
                } else {
                    this.color = "rgba(71,71,71,1)";

                    ctx.fillStyle = "rgb(208,208,208)";
                    ctx.fill(hardCircleL)

                    ctx.fillStyle = "rgb(71,71,71)";
                    ctx.fill(hardCircleR)
                }
                break;
            case "shadows":
                let shadowsCircleL = new Path2D()
                shadowsCircleL.arc(this.x + menu.ox,this.y + menu.oy + this.h / 2,this.h / 2,0,Math.PI * 2)

                let shadowsCircleR = new Path2D()
                shadowsCircleR.arc(this.x + menu.ox + this.w, this.y + menu.oy + this.h / 2, this.h / 2, 0, Math.PI * 2)

                if(this.value) {
                    this.color = "rgba(0,180,255,1)";

                    ctx.fillStyle = "rgb(0,180,255)";
                    ctx.fill(shadowsCircleL)

                    ctx.fillStyle = "rgb(208,208,208)";
                    ctx.fill(shadowsCircleR)
                } else {
                    this.color = "rgba(71,71,71,1)";

                    ctx.fillStyle = "rgb(208,208,208)";
                    ctx.fill(shadowsCircleL)

                    ctx.fillStyle = "rgb(71,71,71)";
                    ctx.fill(shadowsCircleR)
                }
                break;
            default:
                break;
        }

        ctx.font = `${this.textSize}px Helvetica`;
        ctx.fillStyle = "black";
        ctx.textAlign = "start";
        ctx.fillText(this.text,menu.ox + this.tx,menu.oy + this.ty);
    }

    ClickCheck(x,y) {
        switch (this.type) {
            case "button":
                return x > this.x + menu.ox && x < this.x + menu.ox + this.w && y > this.y + menu.oy && y < this.y + menu.oy + this.h;
            case "slider":
                console.log(this.y + menu.oy, y)
                let Vx = menu.ox + this.x + width * 0.18;
                let Vw = this.w - width * 0.21;
                let Vy = this.y + menu.oy;
                return x > Vx && x < Vx + Vw && y > this.y + menu.oy && y < Vy + this.h;
            case "check":
                return x > this.x + menu.ox - this.h / 2 && x < this.x + menu.ox - this.h / 2 + this.w + this.h && y > this.y + menu.oy && y < this.y + menu.oy + this.h;
            default:
                return false;
        }
    }
}