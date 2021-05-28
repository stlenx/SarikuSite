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

                    let width = objectNw * 0.5;
                    let height = objectNh * 0.5;

                    //Line 1 - Top left, top right
                    dstN = DistToSegment(this.thread.x, this.thread.y, objectNx - width, objectNy - height, objectNx + width, objectNy - height);

                    //Line 2 - Top right, bottom right
                    let dstLine2 = DistToSegment(this.thread.x, this.thread.y, objectNx + width, objectNy - height, objectNx + width, objectNy + height)
                    if(dstLine2 < dstN) dstN = dstLine2;

                    //Line 3 - bottom right, bottom left
                    let dstLine3 = DistToSegment(this.thread.x, this.thread.y, objectNx + width, objectNy + height, objectNx - width,  objectNy + height)
                    if(dstLine3 < dstN) dstN = dstLine3;

                    //Line 4 - bottom left, top left
                    let dstLine4 = DistToSegment(this.thread.x, this.thread.y, objectNx - width, objectNy + height, objectNx - width, objectNy - height)
                    if(dstLine4 < dstN) dstN = dstLine4;

                    if(this.thread.x > objectNx - width && this.thread.x < objectNx + width && this.thread.y > objectNy - height && this.thread.y < objectNy + height) {
                        dstN = dstN * -1;
                    }
                }

                function Clamp(num, min, max) {
                    return Math.min(Math.max(num, min), max);
                }

                function Lerp(v0, v1, t) {
                    return v0*(1-t)+v1*t
                }

                function dist2(vx, vy, wx, wy) {
                    return (vx - wx)*(vx - wx) + (vy - wy)*(vy - wy)
                }
                
                function DistToSegment(px, py, l1x, l1y, l2x, l2y) {
                    let l2 = 1;
                    l2 = dist2(l1x, l1y, l2x, l2y);
                    if (l2 === 0) return dist2(px, py, l1x, l1y);
                    let t = ((px - l1x) * (l2x - l1x) + (py - l1y) * (l2y - l1y)) / l2;
                    t = Math.max(0, Math.min(1, t));
                    return Math.sqrt(dist2(px, py, l1x + t * (l2x - l1x), l1y + t * (l2y - l1y)));
                }

                let h = Clamp( 0.5+0.5*(dst-dstN)/k, 0.0, 1.0 );
                dst = Lerp( dst, dstN, h ) - k*h*(1.0-h);

                r = Lerp(r, Nr, h);
                g = Lerp(g, Ng, h);
                b = Lerp(b, Nb, h);

                //if(dstN < 0) {
                //    //(value - from1) / (to1 - from1) * (to2 - from2) + from2;
                //    let light = (dstN - 0) / (objectNr - 0) * (-50 - 50) +50;
                //    r = Clamp(r + light, 0, 255)
                //    g = Clamp(g + light, 0, 255)
                //    b = Clamp(b + light, 0, 255)
                //}
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

        let buf = new ArrayBuffer(this.ImageData.data.length);

        let buf8 = new Uint8ClampedArray(buf);
        let data = new Uint32Array(buf);

        for (let x = 0; x < output.length; x++) {
            for (let y = 0; y < output[x].length; y++) {
                data[y * this.ImageData.width + x] = (255 << 24) | output[y][x];
            }
        }

        this.ImageData.data.set(buf8);

    }
}