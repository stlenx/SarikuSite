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
                let dstN = 10000;
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
                } else if(objectNtype === 1) {
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
                } else if(objectNtype === 2) {
                    let n = objects[i][4]; //NUmber of lines to make

                    let increment = 6.28319 / n; //Amount of radians to move each iteration.
                    let inside = 0; //Determines if the point is inside the shape or not (0 for false 1 for true)
                    for(let i = 0; i < n; i++) {
                        //float x = r*cos(t) + h;
                        // float y = r*sin(t) + k;
                        let p1x = objectNr * Math.cos(increment * i) + objectNx;
                        let p1y = objectNr * Math.sin(increment * i) + objectNy;

                        let p2x = objectNr * Math.cos(increment * (i + 1)) + objectNx;
                        let p2y = objectNr * Math.sin(increment * (i + 1)) + objectNy;

                        let lineDst = DistToSegment(this.thread.x, this.thread.y, p1x, p1y, p2x, p2y);
                        if(lineDst < dstN) dstN = lineDst;

                        let vector1x = p2x - p1x;
                        let vector1y = p2y - p1y;
                        let length = Math.sqrt((vector1x * vector1x) + (vector1y * vector1y))
                        vector1x /= length;
                        vector1y /= length;
                        vector1x *= length / 2;
                        vector1y *= length / 2;

                        let p3x = p1x + vector1x;
                        let p3y = p1y + vector1y;

                        let vector2x = objectNx - p3x;
                        let vector2y = objectNy - p3y;
                        length = Math.sqrt((vector2x * vector2x) + (vector2y * vector2y))
                        vector2x /= length;
                        vector2y /= length;
                        vector2x *= length / 2;
                        vector2y *= length / 2;

                        if(PointInTriangle(this.thread.x, this.thread.y, p1x, p1y, p2x, p2y, objectNx + vector2x, objectNy + vector2y) === 1) {
                            inside = 1;
                        }

                        //Check intersection
                        //intersections += SegmentIntersection(p1x, p1y, p2x, p2y, this.thread.x, this.thread.y, 9999, this.thread.y);
                    }
                    if(inside === 1) dstN = -dstN;
                    //if(dstN < 0 && -dstN > objectNr) dstN = dstN * -1;
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

                function sign (p1x, p1y, p2x, p2y, p3x, p3y)
                {
                    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
                }

                function PointInTriangle (ptx, pty, v1x, v1y, v2x, v2y, v3x, v3y)
                {
                    let d1 = 0;
                    let d2 = 0;
                    let d3 = 0;
                    let has_neg = 0
                    let has_pos = 0;

                    d1 = sign(ptx, pty, v1x, v1y, v2x, v2y);
                    d2 = sign(ptx, pty, v2x, v2y, v3x, v3y);
                    d3 = sign(ptx, pty, v3x, v3y, v1x, v1y);

                    if((d1 < 0) || (d2 < 0) || (d3 < 0))  {
                        has_neg = 1;
                    }
                    if((d1 > 0) || (d2 > 0) || (d3 > 0)) {
                        has_pos = 1;
                    }

                    if(has_neg === 1 && has_pos === 1) {
                        return 0;
                    }
                    return 1;
                    //return !(has_neg && has_pos);
                }

                function SegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4)
                {
                    let D = 0
                    D = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

                    if(D === 0) return 0;

                    let x = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / D;
                    let y = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / D;

                    let minX = Math.min(x1, x2)
                    let maxX = Math.max(x1, x2)
                    let minY = Math.min(y1, y2)
                    let maxY = Math.max(y1, y2)
                    if(x > x3 && y > minY && y < maxY && x > minX && x < maxX) {
                        return 1;
                    }
                    return 0;
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

            let rgb = 18;
            rgb = (rgb << 8) + 18;
            rgb = (rgb << 8) + 18;
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