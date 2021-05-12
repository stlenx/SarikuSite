let canvas = document.getElementById("canvas");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const type = {
    empty: "empty",
    sand: "sand",
    water: "water",
    barrier: "barrier"
}

const color = {
    empty: [0,0,0],
    sand: [76,70,50],
    water: [78,141,200],
    barrier: [150,150,150]
}

let text = "";

let world = [];
let mouse = {
    clicked: false,
    radius: 1,
    x: 0,
    y:0,
    type: type.sand
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
let imageData = ctx.createImageData(100,100);
let data = imageData.data;

InitializeWorld()

let newCanvas = document.createElement("canvas")
newCanvas.setAttribute("width", imageData.width)
newCanvas.setAttribute("height", imageData.height)
let newCtx = newCanvas.getContext("2d")

function InitializeWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageData = ctx.createImageData(100,100);
    data = imageData.data;

    for(let x = 0; x < imageData.width; x++) {
        world[x] = new Array(imageData.height)
        for(let y = 0; y < imageData.height; y++) {
            world[x][y] = new Cell(x, y, type.empty);
        }
    }
    for(let x = 0; x < world.length; x++) {
        world[x][0] = new Cell(x, 0, type.barrier);
        world[x][world[x].length-1] = new Cell(x, world[x].length-1, type.barrier);
    }
    for(let y = 0; y < world[0].length; y++) {
        world[0][y] = new Cell(0, y, type.barrier);
        world[world.length-1][y] = new Cell(world.length-1, y, type.barrier);
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
}

function drawBorder(xPos, yPos, width, height, thickness = 1) {
    ctx.fillStyle='#ffffff';
    ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

function UpdateWorld() {
    let newWorld = new Array(world.length);
    for(let x = 0; x < world.length; x++) {
        newWorld[x] = new Array(world[x].length)
        for(let y = 0; y < world[x].length; y++) {
            newWorld[x][y] = new Cell(x,y, world[x][y].type);
        }
    }

    for(let x = 1; x < imageData.width - 1; x++) {
        for(let y = 0; y < imageData.height - 1; y++) {
            switch (world[x][y].type) {
                case type.sand:
                    if(world[x][y+1].type === type.empty && newWorld[x][y+1].type === type.empty || world[x][y+1].type === type.water && newWorld[x][y+1].type === type.water) {
                        SwapCell(x, y, new Vector2(0, 1), 1)
                    } else if(world[x - 1][y + 1].type === type.empty && newWorld[x - 1][y+1].type === type.empty || world[x - 1][y + 1].type === type.water && newWorld[x - 1][y+1].type === type.water) {
                        SwapCell(x, y, new Vector2(-1, 1), 1)
                    } else if(world[x + 1][y + 1].type === type.empty && newWorld[x + 1][y+1].type === type.empty || world[x + 1][y + 1].type === type.water && newWorld[x + 1][y+1].type === type.water) {
                        SwapCell(x, y, new Vector2(1, 1), 1)
                    }
                    break;
                case type.water:
                    if(world[x][y+1].type === type.empty && newWorld[x][y+1].type === type.empty) {
                        SwapCell(x, y, new Vector2(0,1), 1)
                    } else if(world[x - 1][y + 1].type === type.empty && newWorld[x - 1][y + 1].type === type.empty) {
                        SwapCell(x, y, new Vector2(-1,1), 1)
                    } else if(world[x + 1][y + 1].type === type.empty && newWorld[x + 1][y + 1].type === type.empty) {
                        SwapCell(x, y, new Vector2(1,1), 1)
                    } else if(world[x - 1][y].type === type.empty && newWorld[x-1][y].type === type.empty) {
                        SwapCell(x, y, new Vector2(-1,0), 1)
                    } else if(world[x + 1][y].type === type.empty && newWorld[x+1][y].type === type.empty) {
                        SwapCell(x, y, new Vector2(1,0), 1)
                    }
                    break;
                default:
                    break;
            }
        }
    }
    for(let x = 1; x < world.length -1; x++) {
        if(world[x][world[x].length-1].type !== type.barrier && world[x][world[x].length-1].type !== type.empty) {
            if(world[x][0].type === type.barrier) {
                newWorld[x][world[x].length-1] = new Cell(x, 0, type.empty)
            } else {
                newWorld[x][world[x].length-1] = new Cell(x, 0, type.empty)
                newWorld[x][0] = world[x][world[x].length-1]
            }
        }
    }
    
    function SwapCell(x, y, direction, amount) {
        newWorld[x + direction.x][y + direction.y] = world[x][y];

        if(newWorld[x][y].type === world[x][y].type) {
            newWorld[x][y] = world[x + direction.x][y + direction.y];
        }

        //if(amount > 1) {
        //    RecursiveMove(x, y, direction, amount)
        //} else {
        //    newWorld[x + direction.x][y + direction.y] = world[x][y];
        //    newWorld[x][y] = world[x + direction.x][y + direction.y];
        //}
    }
    
    function RecursiveMove(x, y, direction, amount) {
        if(amount > 1) {
            if(world[x + direction.x][y + direction.y].type === type.empty && newWorld[x + direction.x][y + direction.y].type === type.empty) {
                RecursiveMove(x + direction.x, y + direction.y, direction, amount - 1)
            } else {
                newWorld[x + direction.x][y + direction.y] = world[x][y];
                newWorld[x][y] = new Cell(x, y, type.empty)
            }
        } else {
            newWorld[x + direction.x][y + direction.y] = world[x][y];
            newWorld[x][y] = new Cell(x, y, type.empty)
        }
    }

    world = newWorld;
}

function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    DrawWorld()

    UpdateWorld()

    if(mouse.clicked) {
        for(let x = mouse.x - mouse.radius; x < mouse.x + mouse.radius; x++) {
            for(let y = mouse.y - mouse.radius; y < mouse.y + mouse.radius; y++) {
                if(x > 0 && x < world.length - 1 && y >= 0 && y < world[0].length) {
                    world[x][y] = new Cell(x, y, mouse.type)
                }
            }
        }
    }

    let x = Remap(mouse.x, 0, 100, 0, window.innerHeight)
    let y = Remap(mouse.y, 0, 100, 0, window.innerHeight)
    let r = Remap(mouse.radius, 0, 100, 0, window.innerHeight)
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

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, 100));
    mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, 100));

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
    if(hover) {
        mouse.type = type[text];
    } else {
        mouse.clicked = true;
    }
})

canvas.addEventListener("mousemove", (e) => {
    mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, 100));
    mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, 100));

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
})

canvas.addEventListener("mouseup", (e) => {
    mouse.clicked = false;
})

canvas.addEventListener("mouseleave", (e) => {
    mouse.clicked = false;
})

window.requestAnimationFrame(frame)