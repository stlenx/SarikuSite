let canvas = document.getElementById("canvas")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d")

let circles = [];
let points = [];

for(let i = 0; i < 10; i++) {
    let posX = getRandom(0, canvas.width);
    let posY = getRandom(0, canvas.height);
    circles.push(new OldCircle(new Vector2(posX, posY), getRandom(20,100)));
}

let point = new Point(new Vector2(500,500), 0, circles, 5000)

player = {
    fov: 69,
    angle: 0,
    mx: 0,
    my: 0,
    speed: 5,
    w: false,
    a: false,
    s: false,
    d: false
}

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
        if(points[i] !== null) {
            let color = Remap(points[i], 0, getDistanceBetween(new Vector2(0,0), new Vector2(canvas.width, canvas.height)), 255,0)
            ctx.fillStyle = `rgb(${color},${color},${color})`;
            let h = Remap(points[i],0, getDistanceBetween(new Vector2(0,0), new Vector2(canvas.width, canvas.height)), 500,0);
            ctx.fillRect(x, 250 - h/2, w, h);
        }
    }
}

function DrawView() {
    points = [];
    for(let angle = player.angle; angle < player.fov + player.angle; angle+=0.1) {
        point.angle = angle;
        point.Draw()
    }
}

function UpdatePos() {
    let direction = getVector2(point.p, new Vector2(player.mx, player.my))
    direction.normalize()
    direction.mult(new Vector2(player.speed, player.speed))
    if(player.w) {
        point.p.add(direction);
    }
    if(player.s) {
        point.p.add(new Vector2(direction.x * -1, direction.y * -1));
    }
}

function frame() {
    ctx.fillStyle = "black"
    ctx.fillRect(0,0, canvas.width, canvas.height)

    //DrawCircles()

    point.Draw()

    DrawView()

    DrawPoints()
    
    UpdatePos()

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousemove", (e) => {
    player.angle = GetAngle(point.p, {x: e.offsetX, y: e.offsetY}) - player.fov / 2
    player.mx = e.offsetX;
    player.my = e.offsetY;
})

window.addEventListener("keydown", (e) => {
    if(e.code === "KeyW") player.w = true;
    if(e.code === "KeyA") player.a = true;
    if(e.code === "KeyS") player.s = true;
    if(e.code === "KeyD") player.d = true;
})

window.addEventListener("keyup", (e) => {
    if(e.code === "KeyW") player.w = false;
    if(e.code === "KeyA") player.a = false;
    if(e.code === "KeyS") player.s = false;
    if(e.code === "KeyD") player.d = false;
})

window.requestAnimationFrame(frame)