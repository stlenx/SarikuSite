let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerWidth * 0.8)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");

let scene = new Scene(canvas.width, canvas.height,ctx);
scene.AddElement(new Circle(500,500, 80))
scene.AddElement(new Square(600,500, new Vector2(200, 200)))
scene.AddElement(new Square(900,500, new Vector2(100, 100)))
scene.AddElement(new Circle(450, 500, 80))

scene.Draw();

function frame() {

    scene.Draw()

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousemove", (e) => {
    scene.elements[0].x = e.offsetX;
    scene.elements[0].y = e.offsetY;
    scene.Calculate()
})

window.requestAnimationFrame(frame)