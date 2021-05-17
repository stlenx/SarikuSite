let canvas = document.getElementById("canvas")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d")

let nest = new Nest(canvas.width / 2, canvas.height / 2, 100)

let mouse = {
    radius: 10,
    x: 0,
    y: 0,
    clicked: false
}

let world = new Array(canvas.width);
for(let x = 0; x < canvas.width; x++) {
    world[x] = new Array(canvas.height)
    for(let y = 0; y < canvas.height; y++) {
        world[x][y] = new Pixel(x, y)
    }
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
let imageData = ctx.createImageData(canvas.width,canvas.height);
function DrawWorld() {
    let buf = new ArrayBuffer(imageData.data.length);

    let buf8 = new Uint8ClampedArray(buf);
    let data = new Uint32Array(buf);
    for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
            let p = world[x][y];

            data[y * world.length + x] =
                (255   << 24) |	// alpha
                (p.b << 16) |	// blue
                (p.g <<  8) |	// green
                p.r;		// red
        }
    }
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0,0)
}

function frame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height)

    DrawWorld()

    nest.Draw()

    nest.Move()

    if(mouse.clicked) {
        for(let x = mouse.x - mouse.radius; x < mouse.x + mouse.radius; x++) {
            for(let y = mouse.y - mouse.radius; y < mouse.y + mouse.radius; y++) {
                world[x][y].MakeFood();
            }
        }
    }

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    mouse.clicked = true;
})

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
})

canvas.addEventListener("mouseup", (e) => {
    mouse.clicked = false;
})

window.requestAnimationFrame(frame)