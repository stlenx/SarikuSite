let Remap = (value, from1, to1, from2, to2) => (value - from1) / (to1 - from1) * (to2 - from2) + from2;

let getLength = number => number.toString().length;

let getRandom = (min, max) => Math.random() * (max - min) + min;

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