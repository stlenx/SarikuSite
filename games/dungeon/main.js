let testWalls = [];
let player;
let map;

let dimensions = 10;
let maxTunnels = 100;
let maxLength = 10;

function setup() {
    map = new Map(dimensions, maxTunnels, maxLength);
    map.generateMap()

    console.log(map.map)

    map.generateWalls()

    //testWalls.push(new Wall(new Vector2(100, 100), new Vector2(50, 0.0001)))
    //testWalls.push(new Wall(new Vector2(100, 100), new Vector2(0, 50)))

    player = new Player(new Vector2(100, 200), map.walls);
}

function frame() {
    player.draw();

    player.walls.forEach((wall) => {
        wall.draw()
    })

    if(input.KeyD) {
       player.dir += 5;
    }

    if(input.KeyA) {
        player.dir -= 5;
    }

    if(input.KeyW) {
        player.forward()
    }

    if(input.KeyS) {
        player.backwards()
    }
}