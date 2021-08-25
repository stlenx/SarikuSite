let floorImage = new Image();
floorImage.src = "img/floor_brick.png";

let player;
let map;

let dimensions = 20;
let maxTunnels = 150;
let maxLength = 15;

function setup() {
    ctx.imageSmoothingEnabled = false;

    map = new Map(dimensions, maxTunnels, maxLength);
    map.generateMap()
    map.generateWalls()

    console.log(map)

    player = new Player(map, true);

    floorImage.onload = function() {
        //Get the image data
        let c = document.createElement('canvas');
        c.setAttribute("width", floorImage.width);
        c.setAttribute("height", floorImage.height);
        let c4 = c.getContext('2d');
        c4.drawImage(floorImage, 0, 0);
        player.image = c4.getImageData(0, 0, floorImage.width, floorImage.height);
    };
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