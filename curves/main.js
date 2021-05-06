let canvas = document.getElementById("scene")
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
let ctx = canvas.getContext("2d");

let lastT = Date.now()
let res = 0.01;
let pointsZ = 15
let MakerMode = true;
let clicked = -1;
let key = null;
let selectionBox = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    mx: 0,
    my: 0
}
let points = [
    new Vector2(Math.floor(canvas.width / 3),Math.floor(canvas.height / 2)),
    new Vector2(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2 + canvas.height / 3)),
    new Vector2(Math.floor((canvas.width / 3) * 2), Math.floor(canvas.height / 2))
]

let curve = new Curve(points)

function DrawPoints() {
    ctx.fillStyle = "green";
    points.forEach((point) => {
        ctx.fillRect(point.x - pointsZ / 2, point.y - pointsZ / 2, pointsZ, pointsZ)
    })

    ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.w, selectionBox.h)
}

function DrawPreview() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.width * 0.2, canvas.height * 0.2)
    ctx.strokeStyle = "black";
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.2, 0)
    ctx.lineTo(canvas.width * 0.2, canvas.height * 0.2)
    ctx.lineTo(0, canvas.height * 0.2)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath();
    for (let i = 0; i < curve.t.length-1; i++) {
        let posX1 = Remap(curve.t[i].x, 0, canvas.width, 0, canvas.width * 0.2)
        let posY1 = Remap(curve.t[i].y, 0, canvas.height, 0, canvas.height * 0.2)
        let posX2 = Remap(curve.t[i+1].x, 0, canvas.width, 0, canvas.width * 0.2)
        let posY2 = Remap(curve.t[i+1].y, 0, canvas.height, 0, canvas.height * 0.2)
        ctx.moveTo(posX1, posY1);
        ctx.lineTo(posX2, posY2);
        ctx.stroke();
    }
    ctx.closePath();
}

function ReCalculate() {
    curve.t = [];
    for(let nt = 0; nt < t; nt+=res) {
        curve.Bezier(curve.points, nt)
    }
}

let t = 0;
function frame() {
    ctx.clearRect(0,0,canvas.width, canvas.height)

    let now = Date.now()
    let delta = lastT - now;
    lastT = now;

    if(t > 1) {
        t = 0;
        curve.t = [];
    }

    curve.Draw(t)

    DrawPoints()

    DrawPreview()

    let interval = delta / 16;

    t+= res * (interval * -1);


    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    if(e.offsetX > selectionBox.x && e.offsetX < selectionBox.x + selectionBox.w && e.offsetY > selectionBox.y && e.offsetY < selectionBox.y + selectionBox.h) {
        selectionBox.mx = e.offsetX;
        selectionBox.my = e.offsetY;
        clicked = -3;
    } else {
        if(key === "ControlLeft") {
            points.push(new Vector2(e.offsetX, e.offsetY))
            if(MakerMode) ReCalculate()
            selectionBox = {
                x: e.offsetX,
                y: e.offsetY,
                w: 0,
                h: 0,
                mx: 0,
                my: 0
            }
        } else {
            let pointC = false;
            for (let i = 0; i < points.length; i++) {
                let cringe = pointsZ / 2;
                let condition1 = e.offsetX > points[i].x - cringe
                let condition2 = e.offsetX < points[i].x + cringe
                let condition3 = e.offsetY > points[i].y - cringe
                let condition4 = e.offsetY < points[i].y + cringe
                if(condition1 && condition2 && condition3 && condition4) {
                    if(key === "ShiftLeft") {
                        points.splice(i, 1)
                        if(MakerMode) ReCalculate()
                    } else {
                        clicked = i;
                    }
                    pointC = true;
                }
            }
            if(!pointC) {
                clicked = -2;
            }
            selectionBox = {
                x: e.offsetX,
                y: e.offsetY,
                w: 0,
                h: 0,
                mx: 0,
                my: 0
            }
        }
    }
})

window.onresize = () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
}

canvas.addEventListener("mousemove", (e) => {
    switch (true) {
        case clicked > -1:
            points[clicked].x = e.offsetX;
            points[clicked].y = e.offsetY;
            if(MakerMode) ReCalculate()
            break;
        case clicked === -2:
            selectionBox.w = e.offsetX - selectionBox.x
            selectionBox.h = e.offsetY - selectionBox.y
            break;
        case clicked === -3:
            points.forEach((p) => {
                let cringe = pointsZ / 2;
                let condition1 = p.x - cringe > selectionBox.x
                let condition2 = p.x + cringe < selectionBox.x + selectionBox.w
                let condition3 = p.y - cringe > selectionBox.y
                let condition4 = p.y + cringe < selectionBox.y + selectionBox.h
                if(condition1 && condition2 && condition3 && condition4) {
                    p.x += e.offsetX - selectionBox.mx
                    p.y += e.offsetY - selectionBox.my
                }
            })

            selectionBox.x += e.offsetX - selectionBox.mx
            selectionBox.y += e.offsetY - selectionBox.my
            selectionBox.mx = e.offsetX;
            selectionBox.my = e.offsetY;

            if(MakerMode) ReCalculate()
            break;
    }
})

canvas.addEventListener("mouseup", (e) => {
    clicked = -1;
})

window.addEventListener("keydown", (e) => {
    key = e.code;
})

window.addEventListener("keyup", (e) => {
    key = null;
})

window.requestAnimationFrame(frame)