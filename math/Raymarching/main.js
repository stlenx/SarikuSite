let canvas = document.getElementById("canvas")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d")

let circles = [];
let points = [];

for(let i = 0; i < 10; i++) {
    let posX = getRandom(0, canvas.width);
    let posY = getRandom(0, canvas.height);
    circles.push(new Circle(new Vector2(posX, posY), getRandom(20,100)));
}

let point = new Point(new Vector2(500,500), 0, circles, 5000)

function signedDstToCircle(p, centre, radius) {
    return getDistanceBetween(centre, p) - radius;
}

function DrawCircles() {
    circles.forEach((c) => {
        ctx.strokeStyle = "blue";
        let circle = new Path2D()
        circle.arc(c.p.x, c.p.y, c.r, 0, Math.PI*2);
        ctx.stroke(circle);
    })
}

function DrawPoints() {
    for (let i = 0; i < points.length; i++) {
        let w = canvas.width / points.length;
        let x = w * i;
        if(points[i] === null) {
            ctx.fillStyle = `rgb(0,0,0)`;
            ctx.fillRect(x, 200, w, 100);
        } else {
            let color = Remap(points[i], 0, getDistanceBetween(new Vector2(0,0), new Vector2(canvas.width, canvas.height)), 255,0)
            ctx.fillStyle = `rgb(${color},${color},${color})`;
            let h = Remap(points[i],0, getDistanceBetween(new Vector2(0,0), new Vector2(canvas.width, canvas.height)), 500,0);
            ctx.fillRect(x, 250 - h/2, w, h);
        }
    }
}

function frame() {
    ctx.clearRect(0,0, canvas.width, canvas.height)

    DrawCircles()

    point.Draw()
    
    DrawPoints()

    if(point.angle > 360) {
        point.angle = 0;
        points = [];
    } else {
        point.angle += 1;
    }

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousemove", (e) => {
    //point.p.x = e.offsetX;
    //point.p.y = e.offsetY;
})

window.requestAnimationFrame(frame)