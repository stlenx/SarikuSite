let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerWidth * 0.8)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");

const type = {
    circle: 0,
    square: 1
}

let gpu = new GPU();
let scene = new Scene(canvas.width, canvas.height,ctx);
scene.AddObject(500, 500, type.circle, 50)
scene.AddObject(500, 500, type.square, 50, 80)
//scene.AddElement(new Square(600,500, new Vector2(200, 200)))
//scene.AddElement(new Square(900,500, new Vector2(100, 100)))
//scene.AddElement(new Circle(450, 500, 80))

function frame() {

    scene.Calculate()
    scene.Draw()

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousemove", (e) => {
    scene.objects[0][0] = e.offsetX;
    scene.objects[0][1] = e.offsetY;
})

function AddButton() {
    let element = document.createElement("h2")
    element.innerHTML = `Element ${scene.objects.length + 1}`

    let x = parseInt(document.getElementById("x").value);
    let y = parseInt(document.getElementById("y").value);
    scene.AddObject(x, y, type.circle, 50)

    document.getElementById("elements").appendChild(element)
}

window.requestAnimationFrame(frame)