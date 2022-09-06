let canvas = document.getElementById("canvas");
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const type = {
    empty: "empty",
    sand: "sand",
    water: "water",
    barrier: "barrier",
    wood: "wood",
    fire: "fire",
    oil: "oil",
    bomb: "bomb"
}

const ran = {
    empty: 0,
    sand: 3,
    water: 3,
    barrier: 0,
    wood: 0,
    fire: 2,
    oil: 3,
    bomb: 0
}

const color = {
    empty: [0,0,0],
    sand: [245,235,216],
    water: [78,141,200],
    barrier: [150,150,150],
    wood: [150,111,51],
    fire: [226,88,34],
    oil: [227, 191, 80],
    bomb: [119,126,84]
}

let text = "";

let resolutions = [100, 200, 300];
let resolution = 100;
let resPicked = false;

let world = [];

let mouse = {
    clicked: false,
    holdingSlider: false,
    radius: 1,
    x: 0,
    y:0,
    type: type.sand,
    SquareTool: false
}

const tools = [
    {
        name: "Square",
        x: canvas.height - 120,
        y: 600,
        r: 100
    },
    {
        name: "Circle",
        x: canvas.height - 120,
        y: 700,
        r: 100
    }
]

//Actual code
let imageData = ctx.createImageData(resolution,resolution);
let data = imageData.data;

let newCanvas = document.createElement("canvas")
newCanvas.setAttribute("width", imageData.width)
newCanvas.setAttribute("height", imageData.height)
let newCtx = newCanvas.getContext("2d")

InitializeWorld()

function InitializeWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageData = ctx.createImageData(resolution,resolution);
    data = imageData.data;

    newCanvas = document.createElement("canvas")
    newCanvas.width = imageData.width;
    newCanvas.height = imageData.height;
    newCtx = newCanvas.getContext("2d")

    for(let x = 0; x < imageData.width; x++) {
        world[x] = new Array(imageData.height)
        for(let y = 0; y < imageData.height; y++) {
            world[x][y] = new Empty(x, y);
        }
    }

    for(let x = 0; x < world.length; x++) {
        world[x][0] = new Barrier(x, 0)
        world[x][world[x].length-1] = new Barrier(x, world[x].length - 1)
    }
    for(let y = 0; y < world[0].length; y++) {
        world[0][y] = new Barrier(0, y)
        world[world.length-1][y] = new Barrier(world.length - 1, y, type.barrier)
    }
}

function DrawWorld() {
    let buf = new ArrayBuffer(imageData.data.length);

    let buf8 = new Uint8ClampedArray(buf);
    let data = new Uint32Array(buf);
    for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
            let c = world[x][y];

            data[y * world.length + x] =
                (255   << 24) |	// alpha
                (c.b << 16) |	// blue
                (c.g <<  8) |	// green
                c.r;		// red
        }
    }
    imageData.data.set(buf8);
    newCtx.putImageData(imageData, 0,0)
    ctx.drawImage(newCanvas,0,0, window.innerHeight, window.innerHeight)
}

function DrawMenu() {
    if(text !== "") {
        let font = new Font(text);
        font.Generate()
        let width = font.img.width * 4;
        ctx.drawImage(font.img, canvas.height / 2 - width / 2,50, width, font.img.height * 4)
    }

    let r = 50;
    let count = 0;
    for (let key in type) {
        drawBorder(canvas.height - r * 2, 50 + count * r * 1.2,r, r, 2)
        ctx.fillStyle = `rgb(${color[key][0]},${color[key][1]},${color[key][2]})`;
        ctx.fillRect(canvas.height - r * 2, 50 + count * r * 1.2,r, r)
        count++;
    }

    ctx.lineWidth = 8;
    ctx.beginPath()
    ctx.moveTo(50,50)
    ctx.lineTo(300,50)
    ctx.stroke()
    ctx.closePath()

    ctx.fillStyle = "white"
    let x = Remap(mouse.radius, 1, 10, 50, 300)
    ctx.fillRect(x - r/2, 50 - r/2, r, r)

    let square = new Image();
    let circle = new Image();
    if(mouse.SquareTool) {
        square.src = "textures/SquareSelected.png";

        circle.src = "textures/CircleUnselected.png";
    } else {
        square.src = "textures/SquareUnselected.png";

        circle.src = "textures/CircleSelected.png";
    }

    ctx.drawImage(square,tools[0].x,tools[0].y,tools[0].r,tools[0].r);
    ctx.drawImage(circle,tools[1].x,tools[1].y,tools[1].r,tools[1].r);
}

function drawBorder(xPos, yPos, width, height, thickness = 1) {
    ctx.fillStyle='#ffffff';
    ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

function UpdateWorld() {
    for(let x = 1; x < imageData.width - 1; x++) {
        for(let y = imageData.height - 1; y >= 0; y--) {
            world[x][y].Update();
        }
    }
}

function SwapCell(x, y, direction, amount) {
    let origin = world[x][y];
    let dest = world[x + direction.x][y + direction.y];

    origin.x = x + direction.x;
    origin.y = y + direction.y;

    dest.x = x;
    dest.y = y;

    world[x + direction.x][y + direction.y] = origin;
    world[x][y] = dest;
}

function PickRes() {
    let r = canvas.height * 0.2;
    let offset = canvas.height * 0.11
    for(let i = 0; i < resolutions.length; i++) {
        drawBorder(offset + r * 1.4 * i, canvas.height / 2,r, r / 2, 2)
        ctx.fillStyle = "black"
        ctx.fillRect( offset + r * 1.4 * i,canvas.height / 2, r,r / 2)

        let resText = resolutions[i]
        let resFont = new Font(resText)
        resFont.Generate()
        let fontImg = resFont.img;
        let height = fontImg.height * 5;
        let width = fontImg.width * 5;
        ctx.drawImage(fontImg,offset + (canvas.height * 0.28 * i) + width * 0.38,canvas.height / 2 +  height / 2, width, height)
    }

    let resText = "choose resolution"
    let resFont = new Font(resText)
    resFont.Generate()
    let fontImg = resFont.img;
    let width = fontImg.width * 4; //Doesn't scale well with different resolutions. Fix it future me >:(
    ctx.drawImage(fontImg, canvas.height / 2 - width / 2,canvas.height / 2 - r, width, fontImg.height * 4)
}

let lastTick = Date.now();
function frame() {

    console.time("Frame");

    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawWorld() //2-5ms uhhhh it's faster i swear

    UpdateWorld() //16-35ms

    if(mouse.clicked) {
        if(mouse.SquareTool) {
            for(let x = mouse.x - mouse.radius; x < mouse.x + mouse.radius; x++) {
                for(let y = mouse.y - mouse.radius; y < mouse.y + mouse.radius; y++) {
                    if(x > 0 && x < world.length - 1 && y >= 0 && y < world[0].length) {
                        if(Math.floor(getRandom(0, mouse.random + 1)) === 0) {
                            world[x][y] = new Cell(x, y, mouse.type);
                        }
                    }
                }
            }
        } else {
            for (let x = mouse.x - mouse.radius; x < mouse.x + mouse.radius; x++) {
                for (let y = mouse.y - mouse.radius; y < mouse.y + mouse.radius; y++) {
                    let dx = x - mouse.x;
                    let dy = y - mouse.y;
                    let distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared <= mouse.radius * mouse.radius) {
                        if(Math.floor(getRandom(0, mouse.random*mouse.random + 1)) === 0) {
                            if(world[x][y].type === type.empty) {
                                world[x][y] = new Cell(x, y, mouse.type);
                            }
                        }
                    }
                }
            }
        }
    }

    let x = Remap(mouse.x, 0, resolution, 0, window.innerHeight)
    let y = Remap(mouse.y, 0, resolution, 0, window.innerHeight)
    let r = Remap(mouse.radius, 0, resolution, 0, window.innerHeight)
    if(mouse.SquareTool) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.beginPath()
        ctx.moveTo(x - r, y - r)
        ctx.lineTo(x + r - 1, y - r)
        ctx.lineTo(x + r - 1, y + r - 1)
        ctx.lineTo(x - r, y + r - 1)
        ctx.lineTo(x - r, y - r)
        ctx.stroke();
        ctx.closePath()
    } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
    }

    DrawMenu()

    if(!resPicked) PickRes()

    console.timeEnd("Frame");

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, resolution));
    mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, resolution));

    if(!resPicked) {
        let r = canvas.height * 0.2;
        let offset = canvas.height * 0.11
        for(let i = 0; i < resolutions.length; i++) {
            ctx.fillStyle = "white"
            ctx.fillRect( offset + r * 1.4 * i,canvas.height / 2, r,r / 2)

            let x = offset + r * 1.4 * i;
            let y = canvas.height / 2;
            if(e.offsetX > x && e.offsetX < x + r && e.offsetY > y && e.offsetY < y + r/2) {
                resolution = resolutions[i];
                console.log(resolution)
                InitializeWorld()
                resPicked = true;
                mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, resolution));
                mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, resolution));
            }
        }
    } else {
        let r = 50;
        let count = 0;
        let hover = false;
        let buttonClick = false;
        for (let key in type) {
            let x = canvas.height - r * 2;
            let y = 50 + count * r * 1.2;
            if(e.offsetX > x && e.offsetX < x+r && e.offsetY > y && e.offsetY < y+r) {
                hover = true;
            }
            count++;
        }

        if(e.offsetX > tools[0].x && e.offsetX < tools[0].x + tools[0].r && e.offsetY > tools[0].y && e.offsetY < tools[0].y + tools[0].r) { //AAAAAAAA square
            buttonClick = true;
            mouse.SquareTool = true;
        }

        if(e.offsetX > tools[1].x && e.offsetX < tools[1].x + tools[1].r && e.offsetY > tools[1].y && e.offsetY < tools[1].y + tools[1].r) { //AAAAAAAA circle
            buttonClick = true;
            mouse.SquareTool = false;
        }

        if(!buttonClick) {
            if(hover) {
                mouse.type = type[text];
                mouse.random = ran[text];
            } else {
                mouse.clicked = true;
            }
        }

        let x = Remap(mouse.radius, 1, 10, 50, 300)
        if(e.offsetX > x - 25 && e.offsetX < x + 25 && e.offsetY > 25 && e.offsetY < 75) {
            mouse.clicked = false;
            mouse.holdingSlider = true;
        }

        //Cringe
        //350,20,100,100
        //450,20,100,100
    }
})

canvas.addEventListener("mousemove", (e) => {
    mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, resolution));
    mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, resolution));

    let r = 50;
    let count = 0;
    let hover = false;
    for (let key in type) {
        let x = canvas.height - r * 2;
        let y = 50 + count * r * 1.2;
        if(e.offsetX > x && e.offsetX < x+r && e.offsetY > y && e.offsetY < y+r) {
            hover = true;
            text = type[key];
        }
        count++;
    }
    if(!hover) text = "";
    if(mouse.holdingSlider) {
        let value = Math.floor(Remap(e.offsetX, 50, 300, 1, 10))
        if(value >= 1 && value <= 10) {
            mouse.radius = value;
        }
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouse.clicked = false;
    mouse.holdingSlider = false;
})

canvas.addEventListener("mouseleave", (e) => {
    mouse.clicked = false;
    mouse.holdingSlider = false;
})

window.addEventListener("keydown", (e) => {
    if(e.code === "KeyR") InitializeWorld()
})

window.requestAnimationFrame(frame)