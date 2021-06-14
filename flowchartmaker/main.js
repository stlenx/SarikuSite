canvas = document.getElementById("grid")
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
ctx = canvas.getContext("2d")
//style = getComputedStyle(document.body)

let grid = { //Values in pixels DUH
    lineThiccness: 2,
    lineColor: "#e2e2e2", //GAYYYYY AAAAAAAAA I HAT THIS #e2e2e2
    gap: 70,
    startPointx: 0,
    startPointy: 0,
    left: 0.5,
    top: 0.5,
}

let mouse = {
    x: 0,
    y: 0,
    pressed: false
}

let addMenu = {
    x: 0,
    y: 0
}

function DrawGrid() {
    ctx.clearRect(0,0, canvas.width, canvas.height)

    ctx.lineWidth = grid.lineThiccness;
    ctx.strokeStyle = grid.lineColor;
    ctx.beginPath();

    for(let i = 0; (grid.startPointx - grid.gap * grid.left) + grid.gap * i > 0; i--) { //Vertical left
        let pos = (grid.startPointx - grid.gap * grid.left) + grid.gap * i;
        ctx.moveTo(pos, -10);
        ctx.lineTo(pos, canvas.height + 10)
    }
    for(let i = 0; (grid.startPointx + grid.gap * (1 - grid.left)) + grid.gap * i < canvas.width; i++) { //Vertical right
        let pos = (grid.startPointx + grid.gap * (1 - grid.left)) + grid.gap * i;
        ctx.moveTo(pos, -10);
        ctx.lineTo(pos, canvas.height + 10)
    }


    for(let i = 0; (grid.startPointy - grid.gap * grid.top) + grid.gap * i > 0; i--) { //Horizontal top
        let pos = (grid.startPointy - grid.gap * grid.top) + grid.gap * i;
        ctx.moveTo(-10, pos);
        ctx.lineTo(canvas.width + 10, pos)
    }
    for(let i = 0; (grid.startPointy + grid.gap * (1 - grid.top)) + grid.gap * i < canvas.height; i++) { //Horizontal bottom
        let pos = (grid.startPointy + grid.gap * (1 - grid.top)) + grid.gap * i;
        ctx.moveTo(-10, pos);
        ctx.lineTo(canvas.width + 10, pos)
    }

    ctx.stroke();
    ctx.closePath();
}

canvas.addEventListener("mousedown", (e) => {
    mouse.pressed = true;
})

document.addEventListener("mousemove", (e) => {
    if(mouse.pressed) {
        let movementX = e.offsetX - mouse.x;
        let movementY = e.offsetY - mouse.y;

        grid.startPointx += movementX;
        grid.startPointy += movementY;

        UpdatePositionStuff(movementX, movementY)
    }

    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    DrawGrid()
})

document.addEventListener("mouseup", (e) => {
    mouse.pressed = false;
})

document.addEventListener("wheel", (e) => {
    GetRatio(e.offsetX, e.offsetY)

    let zoomFactor = 10;
    if(e.wheelDelta > 0) {
        grid.gap += zoomFactor;
        UpdateScaleStuff(zoomFactor)
    } else {
        UpdateScaleStuff(-zoomFactor)
        grid.gap -= zoomFactor;
    }
    grid.gap = grid.gap < 10 ? 10 : grid.gap;

    DrawGrid()
});

function GetRatio(x, y) {
    let maxLeft = Infinity;
    for(let i = 0; (grid.startPointx - grid.gap * grid.left) + grid.gap * i > 0; i--) { //Vertical left
        let pos = (grid.startPointx - grid.gap * grid.left) + grid.gap * i;
        let distance = x - pos;
        if(distance > 0 && distance < maxLeft) {
            maxLeft = distance / grid.gap;
        }
    }

    let maxTop = Infinity;
    for(let i = 0; (grid.startPointy - grid.gap * grid.top) + grid.gap * i > 0; i--) { //Horizontal top
        let pos = (grid.startPointy - grid.gap * grid.top) + grid.gap * i;
        let distance = y - pos;
        if(distance > 0 && distance < maxTop) {
            maxTop = distance / grid.gap;
        }
    }

    maxLeft = maxLeft === Infinity ? 0.5 : maxLeft;
    maxTop = maxTop === Infinity ? 0.5 : maxTop;
    grid.left = maxLeft;
    grid.top = maxTop;
    grid.startPointx = x;
    grid.startPointy = y;
}

document.addEventListener('contextmenu', (e) => {
    CloseMenu();
    OpenMenu(e.pageX, e.pageY);
    e.preventDefault();
}, false);

function CloseMenu() {
    let menu = document.getElementById("menu")
    menu.classList.remove("visible");
}

function OpenMenu(x, y) {
    let menu = document.getElementById("menu")
    menu.classList.add("visible");
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    addMenu.x = x;
    addMenu.y = y;
}

DrawGrid()

//ADDING STUFF

function AddSquare() {
    let chart = document.getElementById("chart");

    let div = document.createElement("div");

    div.classList.add("element");
    div.classList.add("square");

    div.innerHTML = "SQUARE";

    div.style.left = `${addMenu.x}px`;
    div.style.top = `${addMenu.y}px`;

    chart.appendChild(div);
}

function UpdateScaleStuff(change) {
    if(grid.gap + change < 10) return;

    let chart = document.getElementById("chart");

    let children = chart.children;
    for (let i = 0; i < children.length; i++) {
        let element = children[i];
        // Do stuff

        let width = element.offsetWidth;
        let height = element.offsetHeight;

        let padding = parseInt(window.getComputedStyle(element, null).getPropertyValue('padding'))

        width += change * (width / grid.gap)
        height += change * (height / grid.gap)

        width -= padding*2;
        height -= padding*2;

        let x = parseInt(element.style.left);
        let y = parseInt(element.style.top);
        let textSize = parseInt(window.getComputedStyle(element, null).getPropertyValue('font-size'));
        console.log(textSize)

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.fontSize = `${textSize + change / 3}px`;

        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
    }
}

function UpdatePositionStuff(offsetX, offsetY) {
    let chart = document.getElementById("chart");

    let children = chart.children;
    for (let i = 0; i < children.length; i++) {
        let element = children[i];
        // Do stuff

        let x = parseInt(element.style.left);
        let y = parseInt(element.style.top);

        element.style.left = `${x + offsetX}px`;
        element.style.top = `${y + offsetY}px`;
    }
}