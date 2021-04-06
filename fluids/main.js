const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

const N = 64;
const iter = 5;
const scale = 10;

let mPressed = false;
let fluid = new Fluid(0.1, 0, 0, N)
//fluid.initializeArrays()

canvas.setAttribute('width', N * scale);
canvas.setAttribute('height', N * scale);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fluid.step()

    fluid.renderD()

    window.requestAnimationFrame(render)
}

canvas.addEventListener('mousedown', function (e) {
    mPressed = true;
    console.log(e.offsetX / scale, e.offsetY / scale)
})

canvas.addEventListener('mouseup', function (e) {
    mPressed = false;
})

canvas.addEventListener('mousemove', function (e) {
    if(mPressed) {
        fluid.addDensity(Math.floor(e.offsetX / scale), Math.floor(e.offsetY / scale), 100)
    }
})

window.requestAnimationFrame(render)