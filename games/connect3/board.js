class Board {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }

    Draw() {
        //Draw background
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,this.w,this.h);

        //Draw lines
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath()
        let size = this.w / 3;
        for (let i=1; i < 3; i++) {
            ctx.moveTo(size * i,0)
            ctx.lineTo(size * i,this.h)
            ctx.moveTo(0,size * i)
            ctx.lineTo(this.w,size * i)
        }
        ctx.stroke();
        ctx.closePath()

        
    }
}