let origin;
let solver, previewSolver;
let spawn = {
    BallGenerator: 0,
    Ball: 1,
    Chain: 2
}
let lastMouse = {
    x: 0,
    y: 0,
    pressed: false,
    amount: 30,
    type: spawn.BallGenerator,
    randomRadius: false,
    randomColor: false
};

function setup() {
    solver = new Solver();
    previewSolver = new Solver();
}

function frame(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    solver.update(dt);
    previewSolver.update(dt);

    solver.draw();
    previewSolver.drawBalls();
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
                    new Vector2(Lerp(lastMouse.x, ev.offsetX, i / lastMouse.amount), Lerp(lastMouse.y, ev.offsetY, i / lastMouse.amount)),
                    i === 0 || i === lastMouse.amount-1,
                    "rgba(255,255,255,0.5)",
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

    switch (lastMouse.type) {
        case spawn.BallGenerator: {
            let generator = new BallGenerator(
                new Vector2(ev.offsetX, ev.offsetY),
                {
                    radius: 5,
                    random: false,
                    variety: 10,
                    speed: 1
                },
                {
                    color: "white",
                    random: true,
                    speed: 0.5
                },
                200,
                {
                    angle: 0,
                    random: true,
                    variety: 45,
                    speed: 5
                }
            );

            solver.generators.push(generator);

            break;
        }

        case spawn.Ball: {
            break;
        }

        case spawn.Chain: {
            break;
        }
    }
}))

canvas.addEventListener("mousemove", (ev => {
    switch (lastMouse.type) {
        case spawn.Chain:
            AddPreviewRope(ev);
            break;
    }
}))

canvas.addEventListener("mouseup", (ev => {
    lastMouse.pressed = false;

    previewSolver.links.forEach((link) => {
        link.object_1 += solver.objects.length;
        link.object_2 += solver.objects.length;
    })

    previewSolver.objects.forEach((object) => {
        object.color = "white";
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



//RandomToggles
function AddNumberInput(text, id, label, out ) { //No out parameters????
    
}

function RandomizeRadius(value) {
    console.log(value);
    lastMouse.randomRadius = value;

    if(!value) {

    }

    let inputShelf = document.getElementById("random-radius-controls");
    //Variety and speed
    


}



//Number thingy pog
document.addEventListener("mousemove", (e) => {
    let div = document.getElementById("NumberIndicator");
    div.style.left = `${e.pageX + 15}px`;
    div.style.top = `${e.pageY + 15}px`;
})

function ShowNumberIndicator() {
    let div = document.getElementById("NumberIndicator");
    div.style.opacity = "100%";
}

function HideNumberIndicator() {
    let div = document.getElementById("NumberIndicator");
    div.style.opacity = "0";
}

function SetNumberIndicator(value) {
    document.getElementById("NumberIndicator").innerHTML = value;
}

//Substep slider
let sub = document.getElementById("sub");
sub.addEventListener("mouseenter", () => {
    ShowNumberIndicator();
})

sub.addEventListener("mouseleave", () => {
    HideNumberIndicator();
})

sub.addEventListener("mousemove", () => {
    SetNumberIndicator(sub.value);
    solver.subSteps = sub.value;
})