class Board {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }

    Draw() {
        //Draw background
        Bctx.fillStyle = "black";
        Bctx.fillRect(0,0,this.w,this.h);

        //Draw lines
        Bctx.strokeStyle = "white";
        Bctx.lineWidth = 5;
        Bctx.beginPath()
        let size = this.w / 3;
        for (let i=1; i < 3; i++) {
            Bctx.moveTo(size * i,0)
            Bctx.lineTo(size * i,this.h)
            Bctx.moveTo(0,size * i)
            Bctx.lineTo(this.w,size * i)
        }
        Bctx.stroke();
        Bctx.closePath()


    }
}