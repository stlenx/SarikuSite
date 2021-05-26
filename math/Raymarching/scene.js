class Scene {
    constructor(h,ctx) {
        this.h = h;
        this.ctx = ctx;
        this.k = 150;
        this.objects = [];
        this.ImageData = this.ctx.createImageData(this.h,this.h);

        this.InitCalc()
    }

    InitCalc() {
        this.calc = gpu.createKernel(function (objects, n, k) {
            if(n < 1) return 0;

            let r = -1;
            let g = -1;
            let b = -1;

            let dst = 1000;

            for(let i = 0; i < n; i++) {
                let dstN = 0;
                let objectNx = objects[i][0];
                let objectNy = objects[i][1];
                let objectNr = objects[i][3];
                let objectNtype = objects[i][2];
                let Nr = objects[i][5];
                let Ng = objects[i][6];
                let Nb = objects[i][7];

                if(objectNtype === 0) {
                    dstN = Math.sqrt( ((objectNx - this.thread.x) * (objectNx - this.thread.x)) + ((objectNy - this.thread.y) * (objectNy - this.thread.y)) )
                    dstN -= objectNr;
                } else {
                    let objectNw = objects[i][3];
                    let objectNh = objects[i][4];
                    let dx = Math.max(Math.abs(this.thread.x - objectNx) - objectNw * 0.5, 0);
                    let dy = Math.max(Math.abs(this.thread.y - objectNy) - objectNh * 0.5, 0);
                    dstN = dx * dx + dy * dy;
                    if(dstN < 1) dstN = -1;
                }

                function Clamp(num, min, max) {
                    return Math.min(Math.max(num, min), max);
                }

                function Lerp(v0, v1, t) {
                    return v0*(1-t)+v1*t
                }

                let h = Clamp( 0.5+0.5*(dst-dstN)/k, 0.0, 1.0 );
                dst = Lerp( dst, dstN, h ) - k*h*(1.0-h);

                r = Lerp(r, Nr, h);
                g = Lerp(g, Ng, h);
                b = Lerp(b, Nb, h);
            }

            if(dst < 0) {
                let rgb = b;
                rgb = (rgb << 8) + g;
                rgb = (rgb << 8) + r;
                return rgb
            }

            let rgb = 0;
            rgb = (rgb << 8) + 0;
            rgb = (rgb << 8) + 0;
            return rgb
        }).setOutput([this.h, this.h])
    }

    AddObject(x, y, type, r, g, b, s, sx = 0) {
        this.objects.push([x, y, type, s, sx, r, g, b])
        this.InitCalc()
    }

    Draw() {
        this.ctx.putImageData(this.ImageData, 0,0)
    }

    Calculate() {
        let output = this.calc(this.objects, this.objects.length, this.k);

        //var t0 = performance.now()
        let buf = new ArrayBuffer(this.ImageData.data.length);

        let buf8 = new Uint8ClampedArray(buf);
        let data = new Uint32Array(buf);

        //var t1 = performance.now()
        //console.log((t1 - t0) + " milliseconds.")

        for (let x = 0; x < output.length; x++) {
            for (let y = 0; y < output[x].length; y++) {
                data[y * this.ImageData.width + x] = (255 << 24) | output[y][x];
            }
        }

        this.ImageData.data.set(buf8);

    }
}