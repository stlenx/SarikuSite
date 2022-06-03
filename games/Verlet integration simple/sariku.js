//#region OTHER

let Remap = (value, from1, to1, from2, to2) => (value - from1) / (to1 - from1) * (to2 - from2) + from2;

let Lerp = (start, end, amt) => (1-amt)*start+amt*end;

let Clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let getLength = number => number.toString().length;

let getRandom = (min, max) => Math.random() * (max - min) + min;

let CheckBoxCollision = (object1, object2) => object1.y + object1.r > object2.y && object1.y + object1.r < object2.y + object2.h && object1.x > object2.x && object1.x < object2.x + object2.w

function WeightedRandom(weights) {
    let w = normalizeWeights(weights), s = 0, random = Math.random()
    for (let i = 0; i < w.length - 1; ++i) {
        s += w[i];
        if (random < s) {
            return i
        }
    }
    return w.length - 1
}

function normalizeWeights(weights){
    let normalized = [], sum = weights.reduce((acc, cur) => (acc + cur))
    weights.forEach((w) => {normalized.push(w / sum)})
    return normalized
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

//#region Bezier Curve

class BezierCurve {
    constructor(points) {
        this.points = points;
        this.t = [];
    }

    Calculate(increment) {
        this.t = [];
        for (let t = 0; t < 1; t+=increment) {
            this.Bezier(this.points, t)
        }
    }

    Bezier(points, t) {
        if(points.length > 3) {
            let newPoints = [];

            for (let i = 0; i < points.length - 1; i++) {
                let posX = points[i].x + ((points[i+1].x - points[i].x) * t)
                let posY = points[i].y + ((points[i+1].y - points[i].y) * t)

                newPoints.push(new Vector2(posX, posY))
            }

            this.Bezier(newPoints, t)
        } else {
            let posX1 = points[0].x + ((points[1].x - points[0].x) * t)
            let posY1 = points[0].y + ((points[1].y - points[0].y) * t)

            let posX2 = points[1].x + ((points[2].x - points[1].x) * t)
            let posY2 = points[1].y + ((points[2].y - points[1].y) * t)

            let posX3 = posX1 + ((posX2 - posX1) * t)
            let posY3 = posY1 + ((posY2 - posY1) * t)

            this.t.push(new Vector2(posX3, posY3))
        }
    }
}

//#endregion

//#region Vector2

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    normalize() {
        let h = this.Length()
        this.x /= h;
        this.y /= h;
    }

    ReturnNormalized() {
        let h = this.Length()
        return new Vector2(this.x / h, this.y / h)
    }

    mult(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    minus(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    Scale(amount) {
        this.x *= amount;
        this.y *= amount;
    }

    ReturnMult(vector) {
        return new Vector2(this.x * vector, this.y * vector)
    }

    ReturnAdd(vector) {
        return new Vector2(this.x + vector, this.y + vector)
    }

    ReturnMinus(vector) {
        return new Vector2(this.x - vector, this.y - vector)
    }

    ReturnScaled(amount) {
        return new Vector2(this.x * amount, this.y * amount)
    }
}

function absVector2(a) {
    let newVector = new Vector2()
    newVector.x = a.x < 0 ? a.x * -1 : a.x;
    newVector.y = a.y < 0 ? a.y * -1 : a.y;
    return newVector;
}

let GetAngle = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

let getVector2 = (a, b) => new Vector2(b.x - a.x, b.y - a.y)

let getDistanceBetween = (a, b) => Math.sqrt( ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)) )

//#endregion

//#region Vector3

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    RAdd(vector) {
        let x = vector.x + this.x;
        let y = vector.y + this.y;
        let z = vector.z + this.z;

        return new Vector3(x,y,z);
    }

    RRes(vector) {
        let x = vector.x - this.x;
        let y = vector.y - this.y;
        let z = vector.z - this.z;

        return new Vector3(x,y,z);
    }

    Add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    Res(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    Length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z))
    }

    normalize() {
        let length = this.Length()
        this.x = this.x / length;
        this.y = this.y / length;
        this.z = this.z / length;
    }
}

let dot3 = (a, b)  => (a.x * b.x) + (a.y * b.y) + (a.z * b.z);

//#endregion

//#region Sound

function Sound(src, volume) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = volume;
    this.sound.onended = function() { this.remove(); }
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
    this.delete = function (){
        this.sound.remove();
    }
}

//#endregion

//#region SoundPlayer

function SoundPlayer(audioContext, filterNode) {
    this.audioCtx = audioContext;
    this.gainNode = this.audioCtx.createGain();
    if(filterNode) {
        // run output through extra filter (already connected to audioContext)
        this.gainNode.connect(filterNode);
    } else {
        this.gainNode.connect(this.audioCtx.destination);
    }
    this.oscillator = null;
}

SoundPlayer.prototype.setFrequency = function(val, when) {
    if(this.oscillator !== null) {
        if(when) {
            this.oscillator.frequency.setValueAtTime(val, this.audioCtx.currentTime + when);
        } else {
            this.oscillator.frequency.setValueAtTime(val, this.audioCtx.currentTime);
        }
    }
    return this;
};

SoundPlayer.prototype.setVolume = function(val, when) {
    if(when) {
        this.gainNode.gain.exponentialRampToValueAtTime(val, this.audioCtx.currentTime + when);
    } else {
        this.gainNode.gain.setValueAtTime(val, this.audioCtx.currentTime);
    }
    return this;
};

SoundPlayer.prototype.setWaveType = function(waveType) {
    this.oscillator.type = waveType;
    return this;
};

SoundPlayer.prototype.play = function(freq, vol, wave, when) {
    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.connect(this.gainNode);
    this.setFrequency(freq);
    if(wave) {
        this.setWaveType(wave);
    }
    this.setVolume(1/1000);
    if(when) {
        this.setVolume(1/1000, when - 0.02);
        this.oscillator.start(when - 0.02);
        this.setVolume(vol, when);
    } else {
        this.oscillator.start();
        this.setVolume(vol, 0.02);
    }
    return this;
};

SoundPlayer.prototype.stop = function(when) {
    if(when) {
        this.gainNode.gain.setTargetAtTime(1/1000, this.audioCtx.currentTime + when - 0.05, 0.02);
        this.oscillator.stop(this.audioCtx.currentTime + when);
    } else {
        this.gainNode.gain.setTargetAtTime(1/1000, this.audioCtx.currentTime, 0.02);
        this.oscillator.stop(this.audioCtx.currentTime + 0.05);
    }
    return this;
};

//#endregion

//#endregion
let presets = {
    fullscreen : "fullscreen",
    square: "square"
}

let canvas = document.getElementById("canvas")
let property = null;
if(canvas.getAttribute('property') !== null) {
    switch (canvas.getAttribute('property')) {
        case presets.fullscreen: {
            canvas.setAttribute("width", window.innerWidth);
            canvas.setAttribute("height", window.innerHeight);
            property = presets.fullscreen;
            break;
        }
        case presets.square: {
            canvas.setAttribute("width", window.innerHeight <= window.innerWidth ? window.innerHeight : window.innerWidth);
            canvas.setAttribute("height", window.innerHeight <= window.innerWidth ? window.innerHeight : window.innerWidth);
            property = presets.square;
            break;
        }
    }
}
let ctx = canvas.getContext("2d");

let input = {};

let mouse = new Vector2(0, 0);

window.addEventListener("keydown", (e) => {
    input[e.code] = true;
})

window.addEventListener("keyup", (e) => {
    input[e.code] = false;
})

window.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
})

if (typeof setup == 'function') {
    setup();
}

let lastFrame = Date.now();
function animationFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let now = Date.now();
    let dt = now - lastFrame;
    lastFrame = now;

    frame(dt);

    window.requestAnimationFrame(animationFrame);
}

if (typeof frame == 'function') {
    window.requestAnimationFrame(animationFrame);
}

if (typeof resize == 'function') {
    window.onresize = resize;
} else {
    switch (property) {
        case presets.fullscreen:
            window.onresize = function () {
                canvas.setAttribute("width", window.innerWidth);
                canvas.setAttribute("height", window.innerHeight);
            }
            break;

        case presets.square:
            window.onresize = function () {
                canvas.setAttribute("width", window.innerHeight <= window.innerWidth ? window.innerHeight : window.innerWidth);
                canvas.setAttribute("height", window.innerHeight <= window.innerWidth ? window.innerHeight : window.innerWidth);
            }
            break;
    }
}

function StrokeLine(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
}

function StrokeCircle(p, r) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
    ctx.stroke();
    ctx.closePath();
}

function FillCircle(p, r) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
}


function Perlin(seed) {
    function Alea() {
        return (function(args) {
            let s0 = 0;
            let s1 = 0;
            let s2 = 0;
            let c = 1;

            if (args.length === 0) {
                args = [+new Date];
            }
            let mash = Mash();
            s0 = mash(' ');
            s1 = mash(' ');
            s2 = mash(' ');

            for (let i = 0; i < args.length; i++) {
                s0 -= mash(args[i]);
                if (s0 < 0) {
                    s0 += 1;
                }
                s1 -= mash(args[i]);
                if (s1 < 0) {
                    s1 += 1;
                }
                s2 -= mash(args[i]);
                if (s2 < 0) {
                    s2 += 1;
                }
            }
            mash = null;

            let random = function() {
                let t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
                s0 = s1;
                s1 = s2;
                return s2 = t - (c = t | 0);
            };
            random.uint32 = function() {
                return random() * 0x100000000; // 2^32
            };
            random.fract53 = function() {
                return random() +
                    (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
            };
            random.version = 'Alea 0.9';
            random.args = args;
            return random;

        } (Array.prototype.slice.call(arguments)));
    }

    function Mash() {
        let n = 0xefc8249d;

        let mash = function(data) {
            data = data.toString();
            for (let i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                let h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000; // 2^32
            }
            return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
        };

        mash.version = 'Mash 0.9';
        return mash;
    }

    /**
     * You can pass in a random number generator object if you like.
     * It is assumed to have a random() method.
     */
    let SimplexNoise = function(r) {
        if (r === undefined) r = Math;
        this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
        this.p = [];
        for (let i=0; i<256; i++) {
            this.p[i] = Math.floor(r.random()*256);
        }
        // To remove the need for index wrapping, double the permutation table length
        this.perm = [];
        for(let i=0; i<512; i++) {
            this.perm[i]=this.p[i & 255];
        }

        // A lookup table to traverse the simplex around a given point in 4D.
        // Details can be found where this table is used, in the 4D noise method.
        this.simplex = [
            [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
            [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
            [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
            [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
            [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
            [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
            [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
            [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]];
    };

    SimplexNoise.prototype.dot = function(g, x, y) {
        return g[0]*x + g[1]*y;
    };

    SimplexNoise.prototype.noise = function(xin, yin) {
        let n0, n1, n2; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        let F2 = 0.5*(Math.sqrt(3.0)-1.0);
        let s = (xin+yin)*F2; // Hairy factor for 2D
        let i = Math.floor(xin+s);
        let j = Math.floor(yin+s);
        let G2 = (3.0-Math.sqrt(3.0))/6.0;
        let t = (i+j)*G2;
        let X0 = i-t; // Unskew the cell origin back to (x,y) space
        let Y0 = j-t;
        let x0 = xin-X0; // The x,y distances from the cell origin
        let y0 = yin-Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if(x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1.0 + 2.0 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        let ii = i & 255;
        let jj = j & 255;
        let gi0 = this.perm[ii+this.perm[jj]] % 12;
        let gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12;
        let gi2 = this.perm[ii+1+this.perm[jj+1]] % 12;
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0*x0-y0*y0;
        if(t0<0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient
        }
        let t1 = 0.5 - x1*x1-y1*y1;
        if(t1<0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        let t2 = 0.5 - x2*x2-y2*y2;
        if(t2<0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    };

    // 3D simplex noise
    SimplexNoise.prototype.noise3d = function(xin, yin, zin) {
        let n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        let F3 = 1.0/3.0;
        let s = (xin+yin+zin)*F3; // Very nice and simple skew factor for 3D
        let i = Math.floor(xin+s);
        let j = Math.floor(yin+s);
        let k = Math.floor(zin+s);
        let G3 = 1.0/6.0; // Very nice and simple unskew factor, too
        let t = (i+j+k)*G3;
        let X0 = i-t; // Unskew the cell origin back to (x,y,z) space
        let Y0 = j-t;
        let Z0 = k-t;
        let x0 = xin-X0; // The x,y,z distances from the cell origin
        let y0 = yin-Y0;
        let z0 = zin-Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if(x0>=y0) {
            if(y0>=z0)
            { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; } // X Y Z order
            else if(x0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; } // X Z Y order
            else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; } // Z X Y order
        }
        else { // x0<y0
            if(y0<z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; } // Z Y X order
            else if(x0<z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; } // Y Z X order
            else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        let x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        let y1 = y0 - j1 + G3;
        let z1 = z0 - k1 + G3;
        let x2 = x0 - i2 + 2.0*G3; // Offsets for third corner in (x,y,z) coords
        let y2 = y0 - j2 + 2.0*G3;
        let z2 = z0 - k2 + 2.0*G3;
        let x3 = x0 - 1.0 + 3.0*G3; // Offsets for last corner in (x,y,z) coords
        let y3 = y0 - 1.0 + 3.0*G3;
        let z3 = z0 - 1.0 + 3.0*G3;
        // Work out the hashed gradient indices of the four simplex corners
        let ii = i & 255;
        let jj = j & 255;
        let kk = k & 255;
        let gi0 = this.perm[ii+this.perm[jj+this.perm[kk]]] % 12;
        let gi1 = this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]] % 12;
        let gi2 = this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]] % 12;
        let gi3 = this.perm[ii+1+this.perm[jj+1+this.perm[kk+1]]] % 12;
        // Calculate the contribution from the four corners
        let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
        if(t0<0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
        }
        let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
        if(t1<0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
        }
        let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
        if(t2<0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
        }
        let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
        if(t3<0) n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0*(n0 + n1 + n2 + n3);
    };

// Classic Perlin noise, 3D version
//----------------------------------------------------------------------------//

    let ClassicalNoise = function(r) { // Classic Perlin noise in 3D, for comparison
        if (r === undefined) r = Math;
        this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
        this.p = [];
        for (let i=0; i<256; i++) {
            this.p[i] = Math.floor(r.random()*256);
        }
        // To remove the need for index wrapping, double the permutation table length
        this.perm = [];
        for(let i=0; i<512; i++) {
            this.perm[i]=this.p[i & 255];
        }
    };

    ClassicalNoise.prototype.dot = function(g, x, y, z) {
        return g[0]*x + g[1]*y + g[2]*z;
    };

    ClassicalNoise.prototype.mix = function(a, b, t) {
        return (1.0-t)*a + t*b;
    };

    ClassicalNoise.prototype.fade = function(t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    };

    ClassicalNoise.prototype.noise = function(x, y, z) {
        // Find unit grid cell containing point
        let X = Math.floor(x);
        let Y = Math.floor(y);
        let Z = Math.floor(z);

        // Get relative xyz coordinates of point within that cell
        x = x - X;
        y = y - Y;
        z = z - Z;

        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;

        // Calculate a set of eight hashed gradient indices
        let gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12;
        let gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12;
        let gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12;
        let gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12;
        let gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12;
        let gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12;
        let gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12;
        let gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12;

        // The gradients of each corner are now:
        // g000 = grad3[gi000];
        // g001 = grad3[gi001];
        // g010 = grad3[gi010];
        // g011 = grad3[gi011];
        // g100 = grad3[gi100];
        // g101 = grad3[gi101];
        // g110 = grad3[gi110];
        // g111 = grad3[gi111];
        // Calculate noise contributions from each of the eight corners
        let n000= this.dot(this.grad3[gi000], x, y, z);
        let n100= this.dot(this.grad3[gi100], x-1, y, z);
        let n010= this.dot(this.grad3[gi010], x, y-1, z);
        let n110= this.dot(this.grad3[gi110], x-1, y-1, z);
        let n001= this.dot(this.grad3[gi001], x, y, z-1);
        let n101= this.dot(this.grad3[gi101], x-1, y, z-1);
        let n011= this.dot(this.grad3[gi011], x, y-1, z-1);
        let n111= this.dot(this.grad3[gi111], x-1, y-1, z-1);
        // Compute the fade curve value for each of x, y, z
        let u = this.fade(x);
        let v = this.fade(y);
        let w = this.fade(z);
        // Interpolate along x the contributions from each of the corners
        let nx00 = this.mix(n000, n100, u);
        let nx01 = this.mix(n001, n101, u);
        let nx10 = this.mix(n010, n110, u);
        let nx11 = this.mix(n011, n111, u);
        // Interpolate the four results along y
        let nxy0 = this.mix(nx00, nx10, v);
        let nxy1 = this.mix(nx01, nx11, v);
        // Interpolate the two last results along z
        let nxyz = this.mix(nxy0, nxy1, w);

        return nxyz;
    };


//----------------------------------------------------------------------------//


    let rand = {};
    rand.random = new Alea(seed);
    let noise = new ClassicalNoise(rand);

    this.noise = function (x, y, z) {
        return 0.5 * noise.noise(x, y, z) + 0.5;
    }

}