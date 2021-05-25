let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerWidth * 0.8)
canvas.setAttribute("height", window.innerHeight)
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
    square: 1
}

let clicked = false;
let drawBorders = false;
let TypeToMake = 0;
let selected = 0;
let gpu = new GPU();
let scene = new Scene(canvas.width, canvas.height,ctx);
scene.AddObject(500, 500, type.circle, 255, 0, 0, 50)
//scene.AddObject(500, 500, type.square, 50, 80)

function frame() {
    scene.k = parseInt(document.getElementById("k").value)

    scene.Calculate()
    scene.Draw()

    if(drawBorders) DrawBorders()

    window.requestAnimationFrame(frame)
}

function DrawBorders() {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    scene.objects.forEach((o) => {
        switch (o[2]) { //index 3 is type
            case type.circle:
                ctx.beginPath();
                ctx.arc(o[0], o[1], o[3], 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case type.square:
                ctx.strokeRect(o[0] - o[3] / 2, o[1] - o[4] / 2, o[3], o[4]);
                break;
        }
    })
}

function ChangeType(value) {
    switch (value) {
        case type.circle:
            TypeToMake = type.circle;
            RemoveParameter("w")
            RemoveParameter("h")
            AddParameter(50, "r", "Radius: ")
            break;
        case type.square:
            TypeToMake = type.square;

            RemoveParameter("r")
            AddParameter(100, "w", "Width: ")
            AddParameter(100, "h", "Height: ")

            break;
    }
}

function RemoveParameter(id) {
    document.getElementById(id).remove();
    document.getElementById(`for-${id}`).remove();
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

function SelectElementDoubleClick(id) {
    let a = document.getElementById(id);
    let h2 = a.lastChild;

    let input = document.createElement("input")
    input.type = "text";
    input.value = h2.innerHTML;
    input.name = id;
    input.onchange = function() {RenameElement(this.name, this.value)}

    a.appendChild(input)

    input.select()

    a.removeChild(h2)
}

function RenameElement(id, text) {
    let a = document.getElementById(id);
    let input = a.lastChild;

    let h2 = document.createElement("h2")
    h2.innerHTML = text;

    a.appendChild(h2)

    a.removeChild(input)
}

function SelectElementLeftClick(id) {
    document.getElementById(selected).style.color="white";
    document.getElementById(id).style.color="red";
    selected = id;
}

function AddButton() {
    let x = parseInt(document.getElementById("x").value);
    let y = parseInt(document.getElementById("y").value);
    let col = hexToRgb(document.getElementById("col").value);

    switch (TypeToMake) {
        case type.circle:
            let r = parseInt(document.getElementById("r").value);
            scene.AddObject(x, y, TypeToMake, col.r,col.g,col.b,r)
            break;
        case type.square:
            let w = parseInt(document.getElementById("w").value);
            let h = parseInt(document.getElementById("h").value);
            scene.AddObject(x, y, TypeToMake, col.r,col.g,col.b,w, h)
            break;
    }

    AddElementHTML()
}

function AddElementHTML() {
    let div = document.getElementById("elements")

    let a = document.createElement("a");
    a.setAttribute("class", "element")
    a.id = scene.objects.length - 1;
    a.onclick = function() {SelectElement(this.id)};
    div.appendChild(a)

    let h2 = document.createElement("h2")
    h2.innerHTML = `Element ${scene.objects.length}`

    a.appendChild(h2)
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
                let objectR = scene.objects[i][3];

                let dx = objectX - e.offsetX;
                let dy = objectY - e.offsetY;
                let distanceSquared = dx * dx + dy * dy;

                if (distanceSquared <= objectR * objectR) {
                    selected = i;
                    clicked = true;
                }
                break;
            case type.square:
                let objectW = scene.objects[i][3];
                let objectH = scene.objects[i][4];

                if(e.offsetX > objectX - objectW / 2 && e.offsetX < objectX + objectW / 2 && e.offsetY > objectY - objectH / 2 && e.offsetY < objectY + objectH / 2) {
                    selected = i;
                    clicked = true;
                }
                break;
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