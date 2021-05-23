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
    scene.calc = gpu.createKernel(function (objects, n, k) {
        if(n < 1) return 0;

        let object1x = objects[0][0];
        let object1y = objects[0][1];
        let object1r = objects[0][2];
        let object1type = objects[0][3];

        let dst = 0;

        if(object1type === 0) {
            dst = Math.sqrt( ((object1x - this.thread.x) * (object1x - this.thread.x)) + ((object1y - this.thread.y) * (object1y - this.thread.y)) )
            dst -= object1r;
        } else {
            let object1w = objects[0][4];
            let object1h = objects[0][5];
            let dx = Math.max(Math.abs(this.thread.x - object1x) - object1w * 0.5, 0);
            let dy = Math.max(Math.abs(this.thread.y - object1y) - object1h * 0.5, 0);
            dst = dx * dx + dy * dy;
            if(dst < 1) dst = -1;
        }

        for(let i = 1; i < n; i++) {
            let dstN = 0;
            let objectNx = objects[i][0];
            let objectNy = objects[i][1];
            let objectNr = objects[i][2];
            let objectNtype = objects[i][3];

            if(objectNtype === 0) {
                dstN = Math.sqrt( ((objectNx - this.thread.x) * (objectNx - this.thread.x)) + ((objectNy - this.thread.y) * (objectNy - this.thread.y)) )
                dstN -= objectNr;
            } else {
                let objectNw = objects[i][4];
                let objectNh = objects[i][5];
                let dx = Math.max(Math.abs(this.thread.x - objectNx) - objectNw * 0.5, 0);
                let dy = Math.max(Math.abs(this.thread.y - objectNy) - objectNh * 0.5, 0);
                dstN = dx * dx + dy * dy;
                if(dstN < 1) dstN = -1;
            }

            let h = Math.max(k-Math.abs(dst-dstN),0) / k;
            dst =  Math.min(dst, dstN) - h * h * h * k/6;
        }

        if(dst < 0) {
            return 255
        }
        return 0;
    }).setOutput([canvas.height, canvas.height])

    document.getElementById("elements").appendChild(element)
}

window.requestAnimationFrame(frame)