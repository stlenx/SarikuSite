let player;
let map;

let dimensions = 20;
let maxTunnels = 30;
let maxLength = 20;

function setup() {
    ctx.imageSmoothingEnabled = false;

    map = new Map(dimensions, maxTunnels, maxLength);
    map.generateMap()
    map.generateWalls()

    console.log(map)

    player = new Player(map);
}


function frame(dt) {
    if(input.KeyQ) {
        player.dir -= 1;
    }

    if(input.KeyE) {
        player.dir += 1;
    }

    if(input.KeyW) {
        player.forward()
    }

    if(input.KeyA) {
        player.left()
    }

    if(input.KeyS) {
        player.backwards()
    }

    if(input.KeyD) {
        player.right()
    }

    player.draw(dt);
}

function mousedown() {
    player.shoot();
}