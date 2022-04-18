let player;
let map;

let dimensions = 20;
let maxTunnels = 150;
let maxLength = 15;

function setup() {
    ctx.imageSmoothingEnabled = false;

    map = new Map(dimensions, maxTunnels, maxLength);
    map.GenerateMap();

    console.log(map)

    player = new Player(map, true);
}

function frame(dt) {
    if(input.KeyQ) {
        player.dir -= 1.5;

        if(player.dir < 0) {
            player.dir = 360 - player.dir;
        }
    }

    if(input.KeyE) {
        player.dir += 1.5;

        if(player.dir > 360) {
            player.dir = 360 - player.dir;
        }
    }

    if(input.KeyW) {
        player.forward(dt)
    }

    if(input.KeyA) {
        player.left(dt)
    }

    if(input.KeyS) {
        player.backwards(dt)
    }

    if(input.KeyD) {
        player.right(dt)
    }

    player.draw(dt);
}

function mousedown() {
    player.shoot();
}

function resize() {
    canvas.setAttribute("width", window.innerWidth)
    canvas.setAttribute("height", window.innerHeight)
    ctx.imageSmoothingEnabled = false;
}