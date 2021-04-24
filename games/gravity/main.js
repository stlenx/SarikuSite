const canvas = document.getElementById("canvas");
canvas.setAttribute('width', window.innerWidth)
canvas.setAttribute('height', window.innerHeight)
ctx = canvas.getContext('2d');

let clicked = false;
let universe = new Universe(canvas.width, canvas.height);
let CreatedObject = new Planet(0,0,0,0,0);
let maxTrail = 10;
let maxPrediction = 100;
let lastTick = Date.now()

function frame() {
    let now = Date.now()
    let delta = now - lastTick;
    lastTick = now;

    universe.Draw()

    universe.UpdateObjects(delta)

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    CreatedObject = new Planet(e.offsetX, e.offsetY, e.offsetX, e.offsetY, 500);
    universe.objects.push(CreatedObject)
    CreatedObject.Predict()
})

canvas.addEventListener("mousemove", (e) => {
    CreatedObject.mx = e.offsetX;
    CreatedObject.my = e.offsetY;
    if(clicked) CreatedObject.Predict()
})

canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    CreatedObject.InitObject(e.offsetX, e.offsetY)
})

window.onresize = () => {
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)
    universe.UpdateSize(canvas.width, canvas.height)
}

window.requestAnimationFrame(frame)