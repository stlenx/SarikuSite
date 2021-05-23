class Scene {
    constructor(w, h,ctx) {
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.elements = [];
        this.imageData = null;
    }

    AddElement(element) {
        this.elements.push(element)
    }

    Draw() {
        if(this.imageData === null) this.Calculate()
        this.ctx.putImageData(this.imageData, 0,0)
    }

    Calculate() {
        this.imageData = this.ctx.createImageData(this.w,this.h);

        let output = DumbShitFuck(this.elements[0].x, this.elements[0].y, 50);

        let buf = new ArrayBuffer(this.imageData.data.length);

        let buf8 = new Uint8ClampedArray(buf);
        let data = new Uint32Array(buf);
        for (let x = 0; x < output.length; x++) {
            for (let y = 0; y < output[x].length; y++) {

                //let col = this.GetPixel(x, y)
                let col = output[y][x];

                data[y * this.imageData.width + x] =
                    (255   << 24) |	// alpha
                    (col << 16) |	// blue
                    (col <<  8) |	// green
                    col;		    // red
            }
        }
        this.imageData.data.set(buf8);
    }

    GetPixel(x, y) {
        if(this.elements.length === 0) return new Color(0,0,0)

        let dst = this.elements[0].GetDistance(x, y);

        for(let i = 0; i < this.elements.length; i++) {
            dst = smooth(dst, this.elements[i].GetDistance(x, y), 300)
        }

        if(dst < 0) {
            return new Color(255,255,255)
        }
        return new Color(0,0,0)

        function smooth(dst1, dst2, k) {
            let h = Math.max(k-Math.abs(dst1-dst2),0) / k;
            return Math.min(dst1, dst2) - h * h * h * k/6;
        }
    }
}

class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}