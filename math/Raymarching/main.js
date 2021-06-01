let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerHeight * 0.94)
canvas.setAttribute("height", window.innerHeight *0.94)
let ctx = canvas.getContext("2d");

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(let i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

const type = {
    circle: 0,
    square: 1,
    polygon: 2
}

let clicked = false;
let drawBorders = false;
let TypeToMake = 0;
let selected = 0;
let Modify = false;
let gpu = new GPU();
let scene = new Scene(canvas.height,ctx);
scene.AddObject(500, 500, type.circle, 255, 0, 0, 50)
//scene.AddObject(500, 500, type.square, 50, 80)

let k = document.getElementById("k");
function frame() {
    scene.k = parseInt(k.value)

    scene.Calculate()

    scene.Draw()

    if(drawBorders) DrawBorders()

    if(Modify) UpdateSelected();

    window.requestAnimationFrame(frame)
}

function UpdateSelected() {
    let x = parseInt(document.getElementById("x").value);
    let y = parseInt(document.getElementById("y").value);
    let col = hexToRgb(document.getElementById("col").value);

    switch (scene.objects[selected][2]) {
        case type.circle: {
            let r = parseInt(document.getElementById("r").value);
            UpdateValues(selected,x, y, scene.objects[selected][2], col.r,col.g,col.b,r)
            break;
        }
        case type.square: {
            let w = parseInt(document.getElementById("w").value);
            let h = parseInt(document.getElementById("h").value);
            UpdateValues(selected,x, y, scene.objects[selected][2], col.r,col.g,col.b,w, h)
            break;
        }
        case type.polygon: {
            let r = parseInt(document.getElementById("r").value);
            let s = parseInt(document.getElementById("s").value);
            UpdateValues(selected,x, y, scene.objects[selected][2], col.r,col.g,col.b,r, s)
            break;
        }
    }
}

function UpdateValues(i, x, y, type, r, g, b, s, sx = 0) {
    scene.objects[i][0] = x;
    scene.objects[i][1] = y;
    scene.objects[i][2] = type;
    scene.objects[i][3] = s;
    scene.objects[i][4] = sx;
    scene.objects[i][5] = r;
    scene.objects[i][6] = g;
    scene.objects[i][7] = b;
}

function DrawBorders() {
    //ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    scene.objects.forEach((o) => {
        ctx.strokeStyle = `rgb(${255 - o[5]}, ${255 - o[6]}, ${255 - o[7]})`;
        switch (o[2]) { //index 3 is type
            case type.circle:
                ctx.beginPath();
                ctx.arc(o[0], o[1], o[3], 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case type.square:
                ctx.strokeRect(o[0] - o[3] / 2, o[1] - o[4] / 2, o[3], o[4]);
                break;
            case type.polygon:
                let n = o[4]; //NUmber of lines to make
                let objectNr = o[3];
                let objectNx = o[0];
                let objectNy = o[1];

                let increment = 6.28319 / n; //Amount of radians to move each iteration.

                ctx.beginPath();
                for(let i = 0; i < n; i++) {
                    //float x = r*cos(t) + h;
                    // float y = r*sin(t) + k;
                    let p1x = objectNr * Math.cos(increment * i) + objectNx;
                    let p1y = objectNr * Math.sin(increment * i) + objectNy;

                    let p2x = objectNr * Math.cos(increment * (i + 1)) + objectNx;
                    let p2y = objectNr * Math.sin(increment * (i + 1)) + objectNy;

                    ctx.moveTo(p1x, p1y);
                    ctx.lineTo(p2x, p2y);
                }
                ctx.stroke();
                ctx.closePath();
                break;
        }
    })
}

function ChangeType(value) {
    RemoveAllParameters()
    switch (value) {
        case type.circle:
            TypeToMake = type.circle;
            AddParameter(50, "r", "Radius: ")
            break;
        case type.square:
            TypeToMake = type.square;
            AddParameter(100, "w", "Width: ")
            AddParameter(100, "h", "Height: ")
            break;
        case type.polygon:
            TypeToMake = type.polygon;
            AddParameter(50, "r", "Radius: ")
            AddParameterSlider(3, "s", "Sides: ", 3, 10, 1)
    }
}

function RemoveAllParameters() {
    let container = document.getElementById("parameters");
    while (container.hasChildNodes()) container.removeChild(container.lastChild)
}

function RemoveParameter(id) {
    document.getElementById(id).remove();
    document.getElementById(`for-${id}`).remove();
}

function AddParameterSlider(value, id, text, min, max, step) {
    let container = document.getElementById("parameters");
    let input = document.createElement("input")
    input.type = "range";
    input.value = value;
    input.min = min;
    input.max = max;
    input.step = step;
    input.id = id;

    let label = document.createElement("label")
    label.setAttribute("for", "id")
    label.id = `for-${id}`
    label.innerHTML = text
    container.appendChild(label)
    container.appendChild(input)
}

function AddParameter(value, id, text) {
    let container = document.getElementById("parameters");
    let input = document.createElement("input")
    input.type = "number";
    input.value = value;
    input.id = id;

    let label = document.createElement("label")
    label.setAttribute("for", "id")
    label.id = `for-${id}`
    label.innerHTML = text
    container.appendChild(label)
    container.appendChild(input)
}

let lastClick = Date.now();
function SelectElement(id) {
    let now = Date.now();
    let timeInBetween = now - lastClick;
    if(timeInBetween < 250) {
        //Double click
        SelectElementDoubleClick(id)
    } else {
        //Single click
        SelectElementLeftClick(id)
    }
    lastClick = now;
}

function Unselect() {
    document.getElementById(selected).classList.remove("active");
    Modify = false;
}

function SelectElementDoubleClick(id) {
    let div = document.getElementById(id);
    let span = div.lastChild;

    let input = document.createElement("input")
    input.type = "text";
    input.value = span.innerHTML;
    input.name = id;
    input.setAttribute("class", "renameInput")
    input.onchange = function() {RenameElement(this.name, this.value)}

    div.appendChild(input)

    input.select()

    div.removeChild(span)
}

function RenameElement(id, text) {
    let div = document.getElementById(id);
    let input = div.lastChild;

    let span = document.createElement("span")
    span.innerHTML = text;

    div.appendChild(span)

    div.removeChild(input)
}

function SelectElementLeftClick(id) {
    document.getElementById(selected).classList.remove("active");
    document.getElementById(id).classList.add("active");
    selected = id;

    document.getElementById("x").value = scene.objects[id][0];
    document.getElementById("y").value = scene.objects[id][1];
    document.getElementById("col").value = rgbToHex(scene.objects[id][5],scene.objects[id][6],scene.objects[id][7]);

    switch (scene.objects[id][2]) {
        case type.circle:
            document.getElementById("r").value = scene.objects[id][3];
            break;
        case type.square:
            document.getElementById("w").value = scene.objects[id][3];
            document.getElementById("h").value = scene.objects[id][4];
            break;
    }

    Modify = true;
}

function AddButton() {
    let x = parseInt(document.getElementById("x").value);
    let y = parseInt(document.getElementById("y").value);
    let col = hexToRgb(document.getElementById("col").value);

    switch (TypeToMake) {
        case type.circle:
        {
            let r = parseInt(document.getElementById("r").value);
            scene.AddObject(x, y, TypeToMake, col.r,col.g,col.b,r)
            break;
        }
        case type.square:
        {
            let w = parseInt(document.getElementById("w").value);
            let h = parseInt(document.getElementById("h").value);
            scene.AddObject(x, y, TypeToMake, col.r,col.g,col.b,w, h)
            break;
        }
        case type.polygon:
        {
            let r = parseInt(document.getElementById("r").value);
            let s = parseInt(document.getElementById("s").value);
            scene.AddObject(x, y, TypeToMake, col.r,col.g,col.b,r, s)
            break;
        }
    }

    AddElementHTML()
}

function AddElementHTML() {
    let container = document.getElementById("elements")

    let div = document.createElement("div");
    div.setAttribute("class", "element")
    div.id = scene.objects.length - 1;
    div.onclick = function() {SelectElement(this.id)};
    container.appendChild(div)

    let span = document.createElement("span")
    span.innerHTML = `Element ${scene.objects.length}`

    div.appendChild(span)
}

canvas.addEventListener("mousedown", (e) => {
    scene.objects.forEach((o) => {
        switch (o[2]) {
            case type.circle:
                let dx = o[0] - e.offsetX;
                let dy = o[1] - e.offsetY;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared <= o[3] * o[3]) {

                }
                break;
            case type.square:
                break;
        }
    })
    for(let i = 0; i < scene.objects.length; i++) {
        let objectX = scene.objects[i][0];
        let objectY = scene.objects[i][1];
        let objectType = scene.objects[i][2];

        switch (objectType) {
            case type.circle:
            {
                let objectR = scene.objects[i][3];

                let dx = objectX - e.offsetX;
                let dy = objectY - e.offsetY;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared <= objectR * objectR) {
                    selected = i;
                    clicked = true;
                }
                break;
            }
            case type.square:
                let objectW = scene.objects[i][3];
                let objectH = scene.objects[i][4];

                if(e.offsetX > objectX - objectW / 2 && e.offsetX < objectX + objectW / 2 && e.offsetY > objectY - objectH / 2 && e.offsetY < objectY + objectH / 2) {
                    selected = i;
                    clicked = true;
                }
                break;
            case type.polygon:
            {
                let objectR = scene.objects[i][3];

                let dx = objectX - e.offsetX;
                let dy = objectY - e.offsetY;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared <= objectR * objectR) {
                    selected = i;
                    clicked = true;
                }
                break;
            }
        }
    }
})

canvas.addEventListener("mousemove", (e) => {
    if(scene.objects.length < 1 || !clicked) return;
    scene.objects[selected][0] = e.offsetX;
    scene.objects[selected][1] = e.offsetY;
})

canvas.addEventListener("mouseup", (e) => {
    clicked = false;
})

window.requestAnimationFrame(frame)