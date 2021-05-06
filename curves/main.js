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
let animate = true;

let selectionBox = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    mx: 0,
    my: 0,
    points: []
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

    let posX1 = Remap(curve.t[0].x, 0, canvas.width, 0, canvas.width * 0.2)
    let posY1 = Remap(curve.t[0].y, 0, canvas.height, 0, canvas.height * 0.2)
    ctx.moveTo(posX1, posY1);
    ctx.beginPath();
    for (let i = 1; i < curve.t.length; i++) {
        let posX = Remap(curve.t[i].x, 0, canvas.width, 0, canvas.width * 0.2)
        let posY = Remap(curve.t[i].y, 0, canvas.height, 0, canvas.height * 0.2)
        ctx.lineTo(posX, posY);
    }
    ctx.stroke();
    ctx.closePath();
}

function ReCalculate() {
    curve.t = [];
    let bezierCurve = new BezierCurve(points)
    for(let nt = 0; nt < t; nt+=res) {
        bezierCurve.Bezier(bezierCurve.points, nt)
    }
    curve.t = bezierCurve.t;
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
    updateInputs()

    curve.Draw(t)

    DrawPoints()

    DrawPreview()

    if(animate) {
        let interval = delta / 16;

        t+= res * (interval * -1);
    }

    window.requestAnimationFrame(frame)
}

function updateInputs() {
    let slider = document.getElementById("tRange");
    if(slider !== null) {
        if(t !== slider.value) {
            t = parseFloat(slider.value);
            ReCalculate()
        }
    }
}

function ToggleAnimation() {
    animate = !animate;

    let container = document.getElementById("animateDIV");
    if(animate) {
        let slider = document.getElementById("tRange");
        container.removeChild(slider)
    } else {
        let slider = document.createElement("input")

        slider.type = "range";
        slider.id = "tRange";
        slider.min = "0";
        slider.max = "1";
        slider.step = "0.001";
        slider.value = t;

        container.appendChild(slider)
    }
}

canvas.addEventListener("mousedown", (e) => {
    let conditionFixX1 = e.offsetX < selectionBox.x + selectionBox.w
    let conditionFixX2 = e.offsetX > selectionBox.x;
    if(selectionBox.w < 0) {
        conditionFixX1 = e.offsetX < (selectionBox.x + selectionBox.w) -selectionBox.w;
        conditionFixX2 = e.offsetX > (selectionBox.x + selectionBox.w);
    }

    let conditionFixY1 = e.offsetY < selectionBox.y + selectionBox.h
    let conditionFixY2 = e.offsetY > selectionBox.y;
    if(selectionBox.h < 0) {
        conditionFixY1 = e.offsetY < (selectionBox.y + selectionBox.h) + -selectionBox.h;
        conditionFixY2 = e.offsetY > (selectionBox.y + selectionBox.h);
    }

    if(conditionFixX2 && conditionFixX1 && conditionFixY1 && conditionFixY2) {
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
                my: 0,
                points: []
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
                my: 0,
                points: []
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
            selectionBox.points = [];
            for(let i = 0; i < points.length; i++) {
                let conditionFix1 = points[i].x < selectionBox.x + selectionBox.w
                let conditionFix2 = points[i].x > selectionBox.x;
                if(selectionBox.w < 0) {
                    conditionFix1 = points[i].x < (selectionBox.x + selectionBox.w) -selectionBox.w;
                    conditionFix2 = points[i].x > (selectionBox.x + selectionBox.w);
                }

                let conditionFix3 = points[i].y < selectionBox.y + selectionBox.h
                let conditionFix4 = points[i].y > selectionBox.y;
                if(selectionBox.h < 0) {
                    conditionFix3 = points[i].y < (selectionBox.y + selectionBox.h) + -selectionBox.h;
                    conditionFix4 = points[i].y > (selectionBox.y + selectionBox.h);
                }

                if(conditionFix1 && conditionFix2 && conditionFix3 && conditionFix4) {
                    selectionBox.points.push(i)
                }
            }
            break;
        case clicked === -3:
            selectionBox.points.forEach((p) => {
                points[p].x += e.offsetX - selectionBox.mx
                points[p].y += e.offsetY - selectionBox.my
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