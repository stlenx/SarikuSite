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

        let buf = new ArrayBuffer(this.imageData.data.length);

        let buf8 = new Uint8ClampedArray(buf);
        let data = new Uint32Array(buf);
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {

                let col = this.GetPixel(x, y)

                data[y * this.imageData.width + x] =
                    (255   << 24) |	// alpha
                    (col.b << 16) |	// blue
                    (col.g <<  8) |	// green
                    col.r;		    // red
            }
        }
        this.imageData.data.set(buf8);
    }

    GetPixel(x, y) {
        let dst1 = this.elements[0].GetDistance(x, y);
        let dst2 = this.elements[1].GetDistance(x, y);

        if(smooth(dst1, dst2, 800) < 0) {
            return new Color(0,0,0)
        }
        return new Color(255,255,255)

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