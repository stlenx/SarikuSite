let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerWidth * 0.8)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");

let scene = new Scene(canvas.width, canvas.height,ctx);
scene.AddElement(new Circle(500,500, 80))
//scene.AddElement(new Square(600,500, new Vector2(200, 200)))
//scene.AddElement(new Square(900,500, new Vector2(100, 100)))
//scene.AddElement(new Circle(450, 500, 80))
let test = "hi"

function frame() {

    scene.Draw()
    scene.Calculate()

    window.requestAnimationFrame(frame)
}

canvas.addEventListener("mousemove", (e) => {
    scene.elements[0].x = e.offsetX;
    scene.elements[0].y = e.offsetY;
})

let gpu = new GPU();
const calc = gpu.createKernel(function (x, y, r) {
    let dst1 = Math.sqrt( ((x - this.thread.x) * (x - this.thread.x)) + ((y - this.thread.y) * (y - this.thread.y)) )
    dst1 -= r;

    let dst2 = Math.sqrt( ((500 - this.thread.x) * (500 - this.thread.x)) + ((500 - this.thread.y) * (500 - this.thread.y)) )
    dst2 -= r;

    let k = 300;
    let h = Math.max(k-Math.abs(dst1-dst2),0) / k;
    let result =  Math.min(dst1, dst2) - h * h * h * k/6;

    if(result < 0) {
        return 255
    }
    return 0;
}).setOutput([canvas.height, canvas.height])

function DumbShitFuck(x, y, r) {
    return calc(x, y, r);
}

function AddButton() {
    let element = document.createElement("h2")
    element.innerHTML = `Element ${scene.elements.length + 1}`

    scene.AddElement(new Circle(500,500, 80))
    scene.Calculate()

    document.getElementById("elements").appendChild(element)
}

window.requestAnimationFrame(frame)