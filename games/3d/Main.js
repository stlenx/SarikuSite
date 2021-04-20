let canvas = document.getElementById("scene")
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

const gl = canvas.getContext("webgl")

if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
}

let rotationX = 0.0;
let rotationY = 0.0;
let rotationZ = 0.0;

let w = false;
let a = false;
let s = false;
let d = false;
let space = false;
let f = false;

let position = new Vector3(0,0,0);

let lastTick = Date.now();

let camera = new Camera(0,0,0);
let scene = new Scene(gl, camera)

function frame() {
    let now = Date.now()
    let delta = now - lastTick;
    lastTick = now;

    //rotationZ += delta / 1000;

    //console.log(rotation)

    Inputs()

    scene.Draw()

    window.requestAnimationFrame(frame)
}

function Inputs() {
    if(w) position.z += 0.1;
    if(a) position.x -= 0.1;
    if(s) position.z -= 0.1;
    if(d) position.x += 0.1;
    if(space) position.y += 0.1;
    if(f) position.y -= 0.1;
}

canvas.addEventListener('mousemove', (e) => {
    let posX = Remap(e.offsetX, 0, canvas.width, -5,5)
    let posY = Remap(e.offsetY, 0, canvas.height, -5, 5)
    rotationX = posX;
    rotationY = posY
})

document.addEventListener('keydown', (e) => {
    console.log(e.code)
    if(e.code === "KeyW") w = true;
    if(e.code === "KeyA") a = true;
    if(e.code === "KeyS") s = true;
    if(e.code === "KeyD") d = true;
    if(e.code === "Space") space = true;
    if(e.code === "KeyF") f = true;
});

document.addEventListener('keyup', (e) => {
    console.log(e.code)
    if(e.code === "KeyW") w = false;
    if(e.code === "KeyA") a = false;
    if(e.code === "KeyS") s = false;
    if(e.code === "KeyD") d = false;
    if(e.code === "Space") space = false;
    if(e.code === "KeyF") f = false;
});

window.requestAnimationFrame(frame)
