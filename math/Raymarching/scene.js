class Scene {
    constructor(w, h,ctx) {
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.objects = [];
        this.ImageData = null;

        this.InitCalc()
    }

    InitCalc() {
        this.calc = gpu.createKernel(function (objects, n, k) {
            if(n < 1) return 0;

            let object1x = objects[0][0];
            let object1y = objects[0][1];
            let object1r = objects[0][2];
            let object1type = objects[0][3];

            let dst = 0;

            if(object1type === 0) {
                dst = Math.sqrt( ((object1x - this.thread.x) * (object1x - this.thread.x)) + ((object1y - this.thread.y) * (object1y - this.thread.y)) )
                dst -= object1r;
            } else {
                let object1w = objects[0][4];
                let object1h = objects[0][5];
                let dx = Math.max(Math.abs(this.thread.x - object1x) - object1w * 0.5, 0);
                let dy = Math.max(Math.abs(this.thread.y - object1y) - object1h * 0.5, 0);
                dst = dx * dx + dy * dy;
                if(dst < 1) dst = -1;
            }

            for(let i = 1; i < n; i++) {
                let dstN = 0;
                let objectNx = objects[i][0];
                let objectNy = objects[i][1];
                let objectNr = objects[i][2];
                let objectNtype = objects[i][3];

                if(objectNtype === 0) {
                    dstN = Math.sqrt( ((objectNx - this.thread.x) * (objectNx - this.thread.x)) + ((objectNy - this.thread.y) * (objectNy - this.thread.y)) )
                    dstN -= objectNr;
                } else {
                    let objectNw = objects[i][4];
                    let objectNh = objects[i][5];
                    let dx = Math.max(Math.abs(this.thread.x - objectNx) - objectNw * 0.5, 0);
                    let dy = Math.max(Math.abs(this.thread.y - objectNy) - objectNh * 0.5, 0);
                    dstN = dx * dx + dy * dy;
                    if(dstN < 1) dstN = -1;
                }

                let h = Math.max(k-Math.abs(dst-dstN),0) / k;
                dst =  Math.min(dst, dstN) - h * h * h * k/6;
            }

            if(dst < 0) {
                return 255
            }
            return 0;
        }).setOutput([this.h, this.h])
    }

    AddObject(x, y, type, s, sx = 0) {
        switch (type) {
            case 0: //Circle
                this.objects.push([x, y, s, 0, 0, 0])
                this.InitCalc()
                break;
            case 1:
                this.objects.push([x, y, 0, 1, s, sx])
                this.InitCalc()
                break;
        }
    }

    Draw() {
        if(this.ImageData === null) this.Calculate()
        this.ctx.putImageData(this.ImageData, 0,0)
    }

    Calculate() {
        this.ImageData = this.ctx.createImageData(this.w,this.h);

        let output = this.calc(this.objects, this.objects.length, 300);

        let buf = new ArrayBuffer(this.ImageData.data.length);

        let buf8 = new Uint8ClampedArray(buf);
        let data = new Uint32Array(buf);
        for (let x = 0; x < output.length; x++) {
            for (let y = 0; y < output[x].length; y++) {

                //let col = this.GetPixel(x, y)
                let col = output[y][x];

                data[y * this.ImageData.width + x] =
                    (255   << 24) |	// alpha
                    (col << 16) |	// blue
                    (col <<  8) |	// green
                    col;		    // red
            }
        }
        this.ImageData.data.set(buf8);
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