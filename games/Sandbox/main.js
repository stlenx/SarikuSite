let canvas = document.getElementById("canvas");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const type = {
    empty: "empty", //0
    sand: "sand", //1
    water: "water", //2
    barrier: "barrier", //3
    wood: "wood", //4
    fire: "fire", //5
    oil: "oil" //6
}

const color = {
    empty: [0,0,0],
    sand: [245,235,216],
    water: [78,141,200],
    barrier: [150,150,150],
    wood: [150,111,51],
    fire: [226,88,34],
    oil: [227, 191, 80]
}

let text = "";

let resolutions = [100, 200, 300];
let resolution = 100;
let resPicked = false;

let world = [];
let newWorld = [];
let mouse = {
    clicked: false,
    holdingSlider: false,
    radius: 1,
    x: 0,
    y:0,
    type: type.sand
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    newCanvas.setAttribute("width", imageData.width)
    newCanvas.setAttribute("height", imageData.height)
    newCtx = newCanvas.getContext("2d")

    for(let x = 0; x < imageData.width; x++) {
        world[x] = new Array(imageData.height)
        for(let y = 0; y < imageData.height; y++) {
            world[x][y] = CreateCell(x, y, type.empty);
        }
    }

    for(let x = 0; x < world.length; x++) {
        world[x][0] = CreateCell(x, 0, type.barrier);
        world[x][world[x].length-1] = CreateCell(x, world[x].length-1, type.barrier);
    }
    for(let y = 0; y < world[0].length; y++) {
        world[0][y] = CreateCell(0, y, type.barrier);
        world[world.length-1][y] = CreateCell(world.length - 1, y, type.barrier);
    }
}

function DrawWorld() {
    for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
            let c = world[x][y];
            let index = (y * imageData.width + x) * 4;

            data[index] = c.r;
            data[index+1] = c.g;
            data[index+2] = c.b;
            data[index + 3] = 255;
        }
    }
    newCtx.putImageData(imageData, 0,0)
    ctx.drawImage(newCanvas,0,0, window.innerHeight, window.innerHeight)
}

function DrawMenu() {
    if(text !== "") {
        let font = new Font(text)
        font.Generate()
        let fontImg = font.img;
        let width = 30 * text.length;
        ctx.drawImage(fontImg, canvas.height / 2 - width / 2,50, width, 30)
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
}

function drawBorder(xPos, yPos, width, height, thickness = 1) {
    ctx.fillStyle='#ffffff';
    ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

function UpdateWorld() {

    newWorld = new Array(world.length)
    for(let x = 0; x < world.length; x++){
        newWorld[x] = new Array(world[x].length)
        for(let y = 0; y < world[x].length; y++) {
            switch (world[x][y].type) {
                case type.empty:
                    newWorld[x][y] =  new Empty(x, y)
                    break;
                case type.sand:
                    newWorld[x][y] =  new Sand(x, y, world[x][y].random)
                    break;
                case type.water:
                    newWorld[x][y] =  new Water(x, y, world[x][y].random)
                    break;
                case type.barrier:
                    newWorld[x][y] =  new Barrier(x, y)
                    break;
                case type.wood:
                    newWorld[x][y] =  new Wood(x, y, world[x][y].random)
                    break;
                case type.fire:
                    newWorld[x][y] =  new Fire(x, y, 10, false)
                    break;
                case type.oil:
                    newWorld[x][y] =  new Oil(x, y, world[x][y].random)
                    break;
            }
        }
    } //this fucking thing is like 10ms

    for(let x = 1; x < imageData.width - 1; x++) {
        for(let y = 0; y < imageData.height - 1; y++) {
            world[x][y].Update()
        }
    }

    for(let x = 1; x < world.length -1; x++) {
        if(world[x][world[x].length-1].type !== type.barrier && world[x][world[x].length-1].type !== type.empty) {
            if(world[x][0].type === type.barrier) {
                newWorld[x][world[x].length-1] = CreateCell(x, 0, type.empty)
            } else {
                newWorld[x][world[x].length-1] = CreateCell(x, 0, type.empty)
                newWorld[x][0] = world[x][world[x].length-1]
            }
        }
    } //Like 4-10ms
    
    function RecursiveMove(x, y, direction, amount) {
        if(amount > 1) {
            if(world[x + direction.x][y + direction.y].type === type.empty && newWorld[x + direction.x][y + direction.y].type === type.empty) {
                RecursiveMove(x + direction.x, y + direction.y, direction, amount - 1)
            } else {
                newWorld[x][y] = world[x][y];
                newWorld[x - direction.x][y - direction.y] = new Cell(x, y, type.empty)
            }
        } else {
            newWorld[x + direction.x][y + direction.y] = world[x][y];
            newWorld[x][y] = new Cell(x, y, type.empty)
        }
    }

    world = newWorld;
}

function SwapCell(x, y, direction, amount) {
    newWorld[x + direction.x][y + direction.y] = world[x][y];
    newWorld[x][y] = world[x + direction.x][y + direction.y];
}

function CreateCell(x, y, givenType) {
    switch (givenType) {
        case type.empty:
            return new Empty(x, y)
        case type.sand:
            return new Sand(x, y)
        case type.water:
            return new Water(x, y)
        case type.barrier:
            return new Barrier(x, y)
        case type.wood:
            return new Wood(x, y)
        case type.fire:
            return new Fire(x, y, 10, false)
        case type.oil:
            return new Oil(x, y)
    }
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
        let height = 50;
        let width = height * getLength(resText)
        ctx.drawImage(fontImg,( offset + r * 1.4 * i)  + width/3,canvas.height / 2 + r / 4 - height / 2, width, height)
    }

    let resText = "choose resolution"
    let resFont = new Font(resText)
    resFont.Generate()
    let fontImg = resFont.img;
    let width = 30 * getLength(resText)
    ctx.drawImage(fontImg, canvas.height / 2 - width / 2,canvas.height / 2 - r, width, 30)
}

let lastTick = Date.now();
function frame() {
    //let now = Date.now()
    //let time = now - lastTick;
    //lastTick = now;
    ////console.log(time)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    DrawWorld() //2-5ms

    UpdateWorld() //16-35ms

    if(mouse.clicked) {
        for(let x = mouse.x - mouse.radius; x < mouse.x + mouse.radius; x++) {
            for(let y = mouse.y - mouse.radius; y < mouse.y + mouse.radius; y++) {
                if(x > 0 && x < world.length - 1 && y >= 0 && y < world[0].length) {
                    world[x][y] = CreateCell(x, y, mouse.type)
                }
            }
        }
    }

    let x = Remap(mouse.x, 0, resolution, 0, window.innerHeight)
    let y = Remap(mouse.y, 0, resolution, 0, window.innerHeight)
    let r = Remap(mouse.radius, 0, resolution, 0, window.innerHeight)
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

    DrawMenu()

    if(!resPicked) PickRes()

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
        for (let key in type) {
            let x = canvas.height - r * 2;
            let y = 50 + count * r * 1.2;
            if(e.offsetX > x && e.offsetX < x+r && e.offsetY > y && e.offsetY < y+r) {
                hover = true;
            }
            count++;
        }

        let x = Remap(mouse.radius, 1, 10, 50, 300)

        if(hover) {
            mouse.type = type[text];
        } else {
            mouse.clicked = true;
        }

        if(e.offsetX > x - 25 && e.offsetX < x + 25 && e.offsetY > 25 && e.offsetY < 75) {
            mouse.clicked = false;
            mouse.holdingSlider = true;
        }
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
            mouse.clicked = false;
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