let origin;
let solver, previewSolver;
let lastMouse = {
    x: 0,
    y: 0,
    pressed: false,
    amount: 30
};

function setup() {
    solver = new Solver();
    previewSolver = new Solver();
    origin = new Vector2(canvas.width / 2, 200);
}

let counter = 0;
let angle = 45;
let color = 0;
let colorDir = false;
let angleDir = false;
let radius = 3;
function frame(dt) {
    ctx.fillStyle = "rgb(50,50,50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    solver.update(dt);
    previewSolver.update(dt);

    solver.draw();
    previewSolver.drawBalls();


    counter++;
    if(counter > 10) {
        let rad = -angle * (Math.PI / 180);
        let dir = new Vector2(Math.cos(rad), Math.sin(rad));

        dir.Scale(1);

        solver.objects.push(new VerletObject(
            origin,
            false,
            hslToHex(color, 100, 50),
            radius,
            new Vector2(origin.x + dir.x, origin.y + dir.y)
        ))
        counter = 0;

        if(angleDir) {
            angle -= 10;
        } else {
            angle += 10;
        }
        if(angle > 160 || angle < 20) {
            angleDir = !angleDir;
        }

        radius++;
        if(radius > 15) {
            radius = 3;
        }

        if(colorDir) {
            color -= 1;
        } else {
            color += 1;
        }
        if(color > 360 || color < 0) {
            colorDir = !colorDir;
        }
    }
}

function AddPreviewRope(ev) {
    if(lastMouse.pressed) {
        if(previewSolver.objects.length > 0) {
            previewSolver.objects[previewSolver.objects.length-1].position_current_x = ev.offsetX;
            previewSolver.objects[previewSolver.objects.length-1].position_current_y = ev.offsetY;

        } else {
            let last = null;
            for(let i = 0; i < lastMouse.amount; i++) {
                if(last !== null) {
                    previewSolver.links.push(
                        new Link(
                            last,
                            previewSolver.objects.length,
                            20
                        )
                    )

                    last = previewSolver.objects.length;
                } else {
                    last = previewSolver.objects.length;
                }

                previewSolver.objects.push(new VerletObject(
                    new Vector2(Lerp(ev.offsetX, lastMouse.x, i / lastMouse.amount), Lerp(ev.offsetY, lastMouse.y, i / lastMouse.amount)),
                    i === 0 || i === lastMouse.amount-1,
                    "white",
                    10
                ))
            }
        }
    }
}

canvas.addEventListener("mousedown", (ev => {
    lastMouse.x = ev.offsetX;
    lastMouse.y = ev.offsetY;
    lastMouse.pressed = true;
}))

canvas.addEventListener("mousemove", (ev => {
    AddPreviewRope(ev)
}))

canvas.addEventListener("mouseup", (ev => {
    lastMouse.pressed = false;

    previewSolver.links.forEach((link) => {
        link.object_1 += solver.objects.length;
        link.object_2 += solver.objects.length;
    })

    solver.objects = solver.objects.concat(previewSolver.objects);
    solver.links = solver.links.concat(previewSolver.links);

    previewSolver.objects = [];
    previewSolver.links = [];
}))

//up is negative down is positive deltaY
canvas.addEventListener("wheel", (ev => {
    if(ev.deltaY < 0) {
        lastMouse.amount++;
    } else {
        lastMouse.amount--;
    }

    previewSolver.objects = [];
    previewSolver.links = [];

    AddPreviewRope(ev);
}))