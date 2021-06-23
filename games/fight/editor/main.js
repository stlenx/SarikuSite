let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let background = new Image()
background.src = "../background.jpg";

let FEN = "/ 10"

let level = new Level(FEN, canvas.height)
level.LoadSprites("../")

let shift = false;

let mouse = {
    left: false,
    right: false,
    x: 0,
    y: 0,
    selected: 0,
    size: 10
}

function FENChange(fen) {
    let result = ValidateFEN(fen)

    let invalidTxT = document.getElementById("invalidFEN");
    if(result) {
        invalidTxT.style.opacity = 0;

        FEN = fen;
        level.loadFEN(FEN);
        level.LoadSprites("../")
    } else {
        invalidTxT.style.opacity = 1;
    }
}

function ValidateFEN(FEN) {
    //Check if it's divided into 2 sections
    if(FEN.split(" ").length !== 2) {
        return false;
    }

    //Check if size is NaN
    if(isNaN(parseInt(FEN.split(" ")[1]))) {
        return false;
    }

    let size = parseInt(FEN.split(" ")[1])

    let line = 0;

    let positions = FEN.split(" ")[0];

    let lines = positions.split("/");
    for(let c = 0; c < lines.length; c++) {
        for(let i = 0; i < lines[c].length; i++) {
            let symbol = lines[c][i];

            //Check if there's fucky wucky characters
            if(symbol !== "b" && symbol !== "s" && isNaN(symbol)) {
                return false;
            }

            //Check if the columns went over the size limit
            if(c > size) {
                return false;
            }

            if(isNaN(symbol)) {
                line++;

                //Check if we went over the size limit
                if(line > size) {
                    return false;
                }
            } else {
                let number = symbol;

                while (!isNaN(lines[c][i+1])) {
                    number += lines[c][i+1];
                    console.log(number)
                    i++;
                }
                line += parseInt(number);

                //Check if we went over the size limit
                if(line > size) {
                    return false;
                }
            }
        }
        line = 0;
    }

    mouse.size = size;

    return true;
}

function frame() {
    ctx.drawImage(background, 0,0, canvas.height * (background.width / background.height), canvas.height)

    level.Draw()

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    let s = canvas.height / mouse.size
    ctx.strokeRect(mouse.x * s, mouse.y * s, s, s)

    window.requestAnimationFrame(frame)
}

function AddBlock(x, y, type) {
    //Create new 2d array for calculus
    let size = parseInt(FEN.split(" ")[1]);
    let newLevel = new Array(size + 2);
    for(let x = 0; x < newLevel.length; x++) {
        newLevel[x] = new Array(size + 2);
    }

    //Populate array
    level.blocks.forEach((block) => {
        newLevel[block.x + 1][block.y + 1] = block;
    })

    //Add new block
    switch (type) {
        case 0:
            newLevel[x + 1][y + 1] = new Solid(x, y, canvas.height, size)
            break;
        case 1:
            newLevel[x + 1][y + 1] = new SemiSolid(x, y, canvas.height, size)
            break;
    }

    UpdateLevel(newLevel, size);
}

function RemoveBlock(x, y) {
//Create new 2d array for calculus
    let size = parseInt(FEN.split(" ")[1]);
    let newLevel = new Array(size + 2);
    for(let x = 0; x < newLevel.length; x++) {
        newLevel[x] = new Array(size + 2);
    }

    //Populate array
    level.blocks.forEach((block) => {
        newLevel[block.x + 1][block.y + 1] = block;
    })

    //Remove block
    newLevel[x + 1][y + 1] = undefined;

    UpdateLevel(newLevel, size);
}

function UpdateLevel(newLevel, size) {
    //Empty out blocks array
    level.blocks = [];

    let newFEN = "";

    //Update sprites
    let line = 0;
    for(let ny = 1; ny < size + 1; ny++) {
        for(let nx = 1; nx < size + 1; nx++) {
            let block = newLevel[nx][ny];
            if(block !== undefined) {
                if((nx-1) - line > 0) {
                    newFEN += (nx-1) - line;
                }

                line = nx;
                switch (block.type) {
                    case 0: //Solid
                        //Check each side for using appropriate sprite
                        if(newLevel[nx][ny + 1] !== undefined && newLevel[nx][ny + 1].type === block.type) { //Check below
                            block.posType = 1 << 3 | block.posType;
                        }

                        if(newLevel[nx][ny - 1] !== undefined && newLevel[nx][ny - 1].type === block.type) { //Check above
                            block.posType = 1 << 2 | block.posType;
                        }

                        if(newLevel[nx + 1][ny] !== undefined && newLevel[nx + 1][ny].type === block.type) { //Check right
                            block.posType = 1 << 1 | block.posType;
                        }

                        if(newLevel[nx - 1][ny] !== undefined && newLevel[nx - 1][ny].type === block.type) { //Check left
                            block.posType = 1 | block.posType;
                        }

                        newFEN += "b";
                        break;
                    case 1: //SemiSolid
                        if(newLevel[nx + 1][ny] !== undefined) { //Check right
                            block.posType = 1 << 1 | block.posType;
                        }

                        if(newLevel[nx - 1][ny] !== undefined) { //Check left
                            block.posType = 1 | block.posType;
                        }

                        newFEN += "s";
                        break;
                }
                level.blocks.push(block)
            }
        }
        line = 0;
        newFEN += "/";
    }

    newFEN = newFEN.replace(/\/*$/g, "");

    newFEN = `${newFEN} ${size}`;
    FEN = newFEN;

    UpdateFEN()

    mouse.size = size;

    //Update sprites
    level.LoadSprites("../")
}

function UpdateFEN() {
    let input = document.getElementById("FENinput");
    input.value = FEN;
}

canvas.addEventListener("mousemove", (e) => {
    let x = Math.floor(e.offsetX / (canvas.height / FEN.split(" ")[1]));
    let y = Math.floor(e.offsetY / (canvas.height / FEN.split(" ")[1]));

    if(x !== mouse.x || y !== mouse.y) {
        if(mouse.left) {
            AddBlock(x, y, mouse.selected)
        }
        if(mouse.right) {
            RemoveBlock(x, y)
        }
    }

    mouse.x = Math.floor(e.offsetX / (canvas.height / FEN.split(" ")[1]));
    mouse.y = Math.floor(e.offsetY / (canvas.height / FEN.split(" ")[1]));
})

canvas.addEventListener("mousedown", (e) => {
    switch (e.button) {
        case 0: //Left click
            AddBlock(mouse.x, mouse.y, mouse.selected)
            mouse.left = true;
            break;
        case 2: //Right click
            RemoveBlock(mouse.x, mouse.y)
            mouse.right = true;
            break;
    }
})

canvas.addEventListener("mouseup", (e) => {
    switch (e.button) {
        case 0: //Left click
            mouse.left = false;
            break;
        case 2: //Right click
            mouse.right = false;
            break;
    }
})

//Disable normal right click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false);

function SelectType(div) {
    div.classList.add("selected")
    document.getElementById(`${Math.abs(div.id - 1)}`).classList.remove("selected")

    mouse.selected = parseInt(div.id);
}

document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "ShiftLeft":
            if(!shift) {
                shift = true;
                SwitchSelected()
            }
            break;
    }
})

document.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "ShiftLeft":
            if(shift) {
                shift = false;
                SwitchSelected()
            }
            break;
    }
})


function SwitchSelected() {
    let newSelected = Math.abs(mouse.selected - 1)

    document.getElementById(`${newSelected}`).classList.add("selected")
    document.getElementById(`${mouse.selected}`).classList.remove("selected")

    mouse.selected = newSelected;
}

window.requestAnimationFrame(frame)