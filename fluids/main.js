const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

const N = 150;
const iter = 5;
const scale = 10;

let mPressed = false;
let fluid = new Fluid(0.1, 0, 0.0000001)

canvas.setAttribute('width', N * scale);
canvas.setAttribute('height', N * scale);

let cx = parseInt(0.5 * N)
let cy = parseInt(0.5 * N)

function render() {
    if(mPressed) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                fluid.addDensity(cx + i, cy + j, getRandom(50, 150));
            }
        }
    }

    for (let i = 0; i < 2; i++) {
        let angle = getRandom(0, 6);
        let v = new Vector2(Math.cos(angle), Math.sin(angle))
        v.x *= 4;
        v.y *= 4;

        fluid.addVelocity(cx, cy, v);
    }

    fluid.step()

    fluid.renderD()

    window.requestAnimationFrame(render)
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

canvas.addEventListener('mousedown', function (e) {
    mPressed = true;
})

canvas.addEventListener('mouseup', function (e) {
    mPressed = false;
})

canvas.addEventListener('mousemove', function (e) {
    //if(mPressed) {
    //    fluid.addDensity(e.offsetX / scale, e.offsetY / scale, 10)
    //    fluid.addVelocity(e.offsetX / scale, e.offsetY / scale, new Vector2(Math.cos(1.3), Math.sin(1.3)));
    //}

    cx = parseInt(e.offsetX / scale);
    cy = parseInt(e.offsetY / scale);
})

window.requestAnimationFrame(render)