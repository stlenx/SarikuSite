let player;
let map;

let dimensions = 20;
let maxTunnels = 150;
let maxLength = 10;

function setup() {
    map = new Map(dimensions, maxTunnels, maxLength);
    map.generateMap()
    map.generateWalls()

    player = new Player(map);
}


function frame() {
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

    player.draw();
}