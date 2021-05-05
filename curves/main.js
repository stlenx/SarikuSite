let canvas = document.getElementById("scene")
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
let ctx = canvas.getContext("2d");

let pointsZ = 15
let clicked = -1;
let key = null;
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
}

function DrawPreview() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0, canvas.width * 0.1, canvas.width * 0.1)
    ctx.strokeStyle = "black";
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.1, 0)
    ctx.lineTo(canvas.width * 0.1, canvas.width * 0.1)
    ctx.lineTo(0, canvas.width * 0.1)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath();
    for (let i = 0; i < curve.t.length-1; i++) {
        let posX1 = Remap(curve.t[i].x, 0, canvas.width, 0, canvas.width * 0.1)
        let posY1 = Remap(curve.t[i].y, 0, canvas.height, 0, canvas.width * 0.1)
        let posX2 = Remap(curve.t[i+1].x, 0, canvas.width, 0, canvas.width * 0.1)
        let posY2 = Remap(curve.t[i+1].y, 0, canvas.height, 0, canvas.width * 0.1)
        ctx.moveTo(posX1, posY1);
        ctx.lineTo(posX2, posY2);
        ctx.stroke();
    }
    ctx.closePath();
}

function ReCalculate() {
    curve.t = [];
    for(let nt = 0; nt < t; nt+=0.005) {
        curve.Bezier(curve.points, nt)
    }
}

let t = 0;
function frame() {
    ctx.clearRect(0,0,canvas.width, canvas.height)

    if(t > 1) {
        t = 0;
        curve.t = [];
    }

    curve.Draw(t)

    DrawPoints()

    DrawPreview()

    t+=0.005;

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    if(key === "ControlLeft") {
        points.push(new Vector2(e.offsetX, e.offsetY))
        //ReCalculate()
    } else {
        for (let i = 0; i < points.length; i++) {
            let cringe = pointsZ / 2;
            let condition1 = e.offsetX > points[i].x - cringe
            let condition2 = e.offsetX < points[i].x + cringe
            let condition3 = e.offsetY > points[i].y - cringe
            let condition4 = e.offsetY < points[i].y + cringe
            if(condition1 && condition2 && condition3 && condition4) {
                if(key === "ShiftLeft") {
                    points.splice(i, 1)
                } else {
                    clicked = i;
                }
            }
        }
    }
})

canvas.addEventListener("mousemove", (e) => {
    if(clicked !== -1) {
        points[clicked].x = e.offsetX;
        points[clicked].y = e.offsetY;
        //ReCalculate()
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