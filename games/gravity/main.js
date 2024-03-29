const canvas = document.getElementById("canvas");
canvas.setAttribute('width', window.innerWidth)
canvas.setAttribute('height', window.innerHeight)
Bctx = canvas.getContext('2d');

let clicked = false;
let universe = new Universe(canvas.width, canvas.height);
let CreatedObject = new Planet(0,0,0,0,0);
let maxTrail = 10;
let maxPrediction = 100;
let lastTick = Date.now()
let sunMode = false;

function frame() {
    let now = Date.now()
    let delta = now - lastTick;
    lastTick = now;

    universe.Draw()

    universe.UpdateObjects(delta)

    window.requestAnimationFrame(frame)
}

function ToggleSun() {
    if(sunMode) {
        sunMode = false;
        document.getElementById('sun').innerHTML = "Sun";
    } else {
        sunMode = true;
        document.getElementById('sun').innerHTML = "Planet";
    }
}

canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    CreatedObject = sunMode ? new Sun(e.offsetX, e.offsetY, 500) : new Planet(e.offsetX, e.offsetY, e.offsetX, e.offsetY, 500);
    universe.objects.push(CreatedObject)
    if(!sunMode) CreatedObject.Predict()
})

canvas.addEventListener("mousemove", (e) => {
    if(clicked && !sunMode) {
        CreatedObject.mx = e.offsetX;
        CreatedObject.my = e.offsetY;
        CreatedObject.Predict()
    }
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