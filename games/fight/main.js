let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let background = new Image()
background.src = "background.jpg";

//  //3ssss///1sss2sss///1bbbbbbbb 10
//  //////15sss/ss5b4b/7bssssb/7b4b/5ssb4b2sss/7b4b/7bssssb/ss5b4b/7b4b/5ssb4b2sss/7bssssb/12b/12b/bbbbbbbbbbbbbbbbbbbb 20
let level = new Level("//3ssss///1sss2sss///1bbbbbbbb 10", canvas.width)
level.LoadSprites()

//let player = new Player(100,0, canvas.width, level, "blue")
//let player2 = new Player(canvas.width - 100,0, canvas.width, level, "red")

let players = [
    new Player(100,0, canvas.width, level, "blue"),
    new Player(canvas.width - 100,0, canvas.width, level, "red")
]

let lastFrame = Date.now()
function frame() {
    let now = Date.now()
    let dt = now - lastFrame;
    lastFrame = now

    ctx.drawImage(background, 0,0, canvas.height * (background.width / background.height), canvas.height)

    level.Draw()

    players.forEach((player) => {
        player.Draw()
        player.DebugDraw()
        player.Update(dt)
    })

    window.requestAnimationFrame(frame)
}

window.addEventListener("keydown", (e) => {
     switch (e.code) {
         case "Space":
             players[0].Jump();
             break;
         case "KeyA":
             players[0].left = true;
             break;
         case "KeyD":
             players[0].right = true;
             break;
         case "KeyS":
             players[0].down = true;
             break;

         //Second player
         case "ArrowUp":
             players[1].Jump();
             break;
         case "ArrowLeft":
             players[1].left = true;
             break;
         case "ArrowRight":
             players[1].right = true;
             break;
         case "ArrowDown":
             players[1].down = true;
             break;
     }
})

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyA":
            players[0].left = false;
            break;
        case "KeyD":
            players[0].right = false;
            break;
        case "KeyS":
            players[0].down = false;
            break;

            //Second player
        case "ArrowLeft":
            players[1].left = false;
            break;
        case "ArrowRight":
            players[1].right = false;
            break;
        case "ArrowDown":
            players[1].down = false;
            break;
    }
})

window.requestAnimationFrame(frame)