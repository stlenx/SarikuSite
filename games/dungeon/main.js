let img = new Image();
img.src = "img/floor.png";
img.onload = function() {
    //Get the image data
    let c = document.createElement('canvas');
    c.setAttribute("width", img.width);
    c.setAttribute("height", img.height);
    let c4 = c.getContext('2d');
    c4.drawImage(img, 0, 0);
    player.image = c4.getImageData(0, 0, img.width, img.height);
};

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

    player = new Player(map);
}


function frame(dt) {
    if(input.KeyQ) {
        player.dir -= 1.5;
    }

    if(input.KeyE) {
        player.dir += 1.5;
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