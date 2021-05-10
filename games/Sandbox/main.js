let canvas = document.getElementById("canvas");
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const type = {
    empty: "empty",
    sand: "sand",
    water: "water"
}

let world = [];
let mouse = {
    clicked: false,
    radius: 1,
    x: 0,
    y:0,
    type: type.sand
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
const imageData = ctx.createImageData(100,100);
const data = imageData.data;
//Initialize world
for(let x = 0; x < imageData.width; x++) {
    world[x] = new Array(imageData.height)
    for(let y = 0; y < imageData.height; y++) {
        world[x][y] = new Cell(x, y, type.empty);
    }
}

let newCanvas = document.createElement("canvas")
newCanvas.setAttribute("width", imageData.width)
newCanvas.setAttribute("height", imageData.height)
let newCtx = newCanvas.getContext("2d")

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
    //ctx.putImageData(imageData, 0, 0);
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
                    if(world[x][y+1].type === type.empty) {
                        newWorld[x][y + 1] = world[x][y];
                        newWorld[x][y] = new Cell(x, y, type.empty)
                    } else if(world[x - 1][y + 1].type === type.empty) {
                        newWorld[x - 1][y + 1] = world[x][y];
                        newWorld[x][y] = new Cell(x, y, type.empty)
                    } else if(world[x + 1][y + 1].type === type.empty) {
                        newWorld[x + 1][y + 1] = world[x][y];
                        newWorld[x][y] = new Cell(x, y, type.empty)
                    }
                    break;
                case type.water:
                    if(world[x][y+1].type === type.empty) {
                        newWorld[x][y + 1] = world[x][y];
                        newWorld[x][y] = new Cell(x, y, type.empty)
                    } else if(world[x - 1][y + 1].type === type.empty) {
                        newWorld[x - 1][y + 1] = world[x][y];
                        newWorld[x][y] = new Cell(x, y, type.empty)
                    } else if(world[x + 1][y + 1].type === type.empty) {
                        newWorld[x + 1][y + 1] = world[x][y];
                        newWorld[x][y] = new Cell(x, y, type.empty)
                    } else if(world[x - 1][y].type === type.empty) {
                        if(newWorld[x-1][y].type === type.empty) {
                            newWorld[x - 1][y] = world[x][y];
                            newWorld[x][y] = new Cell(x, y, type.empty)
                        }
                    } else if(world[x + 1][y].type === type.empty) {
                        if(newWorld[x+1][y].type === type.empty) {
                            newWorld[x + 1][y] = world[x][y];
                            newWorld[x][y] = new Cell(x, y, type.empty)
                        }
                    }
                    break;
                case type.empty:
                    break;
            }
        }
    }

    world = newWorld;
}

function frame() {
    DrawWorld()

    UpdateWorld()



    if(mouse.clicked) {
        for(let x = mouse.x - mouse.radius; x < mouse.x + mouse.radius; x++) {
            for(let y = mouse.y - mouse.radius; y < mouse.y + mouse.radius; y++) {
                world[x][y] = new Cell(x, y, mouse.type)
            }
        }
    }

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousedown", (e) => {
    mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, 100));
    mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, 100));
    mouse.clicked = true;
})

canvas.addEventListener("mousemove", (e) => {
    mouse.x = Math.floor(Remap(e.offsetX, 0, window.innerHeight, 0, 100));
    mouse.y = Math.floor(Remap(e.offsetY, 0, window.innerHeight, 0, 100));
})

canvas.addEventListener("mouseup", (e) => {
    mouse.clicked = false;
})

window.requestAnimationFrame(frame)