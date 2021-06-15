let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let background = new Image()
background.src = "background.jpg";

let level = new Level("//3ssss///1sss2sss///1bbbbbbbb 10", canvas.width)
level.LoadSprites()

let player = new Player(100,0, canvas.width, level)

let lastFrame = Date.now()
function frame() {
    let now = Date.now()
    let dt = now - lastFrame;
    lastFrame = now

    ctx.drawImage(background, 0,0, canvas.height * (background.width / background.height), canvas.height)

    level.Draw()

    player.Draw()

    player.DebugDraw()

    player.Update(dt)

    window.requestAnimationFrame(frame)
}

window.addEventListener("keydown", (e) => {
     switch (e.code) {
         case "Space":
             player.Jump();
             break;
         case "KeyA":
             player.left = true;
             break;
         case "KeyD":
             player.right = true;
             break;
         case "KeyS":
             player.down = true;
             break;
     }
})

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyA":
            player.left = false;
            break;
        case "KeyD":
            player.right = false;
            break;
        case "KeyS":
            player.down = false;
            break;
    }
})

window.requestAnimationFrame(frame)