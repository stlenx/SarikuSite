let Remap = (value, from1, to1, from2, to2) => (value - from1) / (to1 - from1) * (to2 - from2) + from2;

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