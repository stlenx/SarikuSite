let canvas = document.getElementById("canvas");
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");

let circle = {
    x: 500,
    y: 500,
    r: 100
}

let player = {
    x: 300,
    y: 200,
    r: 5
}

function frame() {
    ctx.clearRect(0,0,canvas.width, canvas.height)

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
    ctx.stroke();

    let slope = (player.y - circle.y)/(player.x - circle.x)
    //y = mx + b | b = y - mx
    let intercept = player.y - (slope * player.x)

    function getY(x){ return (slope * x) + intercept; }
    function getX(y) { return (y - intercept)/slope; }

    // mark points in the canvas
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(circle.x + 0.5, circle.y + 0.5, player.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 0.5, player.y + 0.5, player.r, 0, 2 * Math.PI);
    ctx.fill();

    // draw a line between two points
    ctx.beginPath();
    ctx.moveTo(getX(0), 0);
    ctx.lineTo(circle.x, circle.y);
    ctx.lineTo(player.x, player.y);
    ctx.lineTo(getX(canvas.height), canvas.height);
    ctx.stroke();

    ctx.closePath();

    DrawIntersection()
    requestAnimationFrame(frame)
}

function DrawIntersection() {


    //let m = (player.y - circle.y) / (player.x - circle.y);
    //let n = circle.y - (m * circle.x);
//
    //let intersections = findCircleLineIntersections(circle.r, circle.x, circle.y, m, n)
    //// mark points in the canvas
    //ctx.fillStyle = "blue";
    //ctx.beginPath();
    //ctx.arc(intersections[0] + 0.5, intersections[1] + 0.5, player.r, 0, 2 * Math.PI);
    //ctx.fill();
}

canvas.addEventListener("mousemove", (e) => {
    player.x = e.offsetX;
    player.y = e.offsetY;
})

window.requestAnimationFrame(frame)

function Min(a, b) {
    return a > b ? b : a
}

function Max(a, b) {
    return a > b ? a : b
}

function Cos(a) {
    return 1 - (a*a) / 2 + (a*a*a*a) / 24 - (a*a*a*a*a*a) / 720 + (a*a*a*a*a*a*a*a) / 40320 - (a*a*a*a*a*a*a*a*a*a) / 3628800 + (a*a*a*a*a*a*a*a*a*a*a*a) / 479001600
}

function OtherCos(a) {
    return Sin(1.5708 - a);
}

function Sin(a) {
    return a - (a*a*a) / 6 + (a*a*a*a*a) / 120 - (a*a*a*a*a*a*a) / 5040 + (a*a*a*a*a*a*a*a*a) / 362880 - (a*a*a*a*a*a*a*a*a*a*a) / 39916800;
}

function Sqrt(n) //Very fucking accurate
{
    let sqrt = n / 2;
    let temp = 0;

    while(sqrt !== temp){
        temp = sqrt;
        sqrt = ( n/temp + temp) / 2;
    }

    return sqrt;
}