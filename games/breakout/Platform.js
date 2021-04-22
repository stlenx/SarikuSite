class Platform {
    constructor(width, height) {
        this.x = width / 2 - (width * 0.25) / 2;
        this.y = height - 50;
        this.w = width * 0.25;
        this.h = width * 0.25 * 0.0666;
        this.color = "#616161";
        this.started = false;
    }

    Draw() {
        if(shadows) {
            let vector = getVector2({x: width / 2, y: 0},{x: this.x + this.w / 2, y: this. y})

            let grd = ctx.createLinearGradient(this.x,this.y,this.x,this.y + this.h + width * 0.05);
            grd.addColorStop(0,"rgba(0,0,0,0.17)");
            grd.addColorStop(1,"rgba(255,255,255,0)");
            // Fill with gradient
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + this.w, this.y)
            if(vector.x < 0) {
                ctx.lineTo(this.x + this.w, this.y + this.h)
                ctx.lineTo(this.x + this.w + vector.x, this.y + vector.y)
                ctx.lineTo(this.x + vector.x, this.y + vector.y)
            } else {
                ctx.lineTo(this.x + this.w + vector.x, this.y + vector.y)
                ctx.lineTo(this.x + vector.x, this.y + vector.y)
                ctx.lineTo(this.x, this.y + this.h)
            }
            ctx.lineTo(this.x, this.y)
            ctx.fill()
            ctx.closePath()
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }

    Start() {
        platform.started = true;

        //Set velocity of balls if hard mode is enabled or not
        balls[0].v = hardMode ? new Vector2(10,-10) : new Vector2(5, -5)

        //Good plays counter thing very nice me good job past me you are so gae
        let saveData = JSON.parse(localStorage.getItem('saveData'));
        if (saveData !== null && saveData.plays !== undefined) plays = saveData.plays + 1

        localStorage.setItem('saveData', JSON.stringify({
            highScore: HighScore,
            plays: plays,
            volume: volume,
            shadows: shadows,
            hardMode: hardMode
        }));
    }
}

