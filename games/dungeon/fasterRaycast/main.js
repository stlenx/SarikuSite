let map =           
[
 [1,1,1,1,1,1,1,1],
 [1,0,1,0,0,0,0,1],
 [1,0,1,0,0,0,0,1],
 [1,0,1,0,0,0,0,1],
 [1,0,0,0,0,0,0,1],
 [1,0,0,0,0,1,0,1],
 [1,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,1],
];

let size;
let x = 300;
let y = 400;
let angle = 0;

function setup() {
    size = canvas.height - 20;
}

function frame() {
    DrawWalls();
    
    DrawLines();

    DrawPlayer();

    DrawRays();

    DrawDxDy();

    if(input.KeyQ) {
        angle -= 2 * (Math.PI / 180);
    }
    if(input.KeyE) {
        angle += 2 * (Math.PI / 180);
    }
    if(input.KeyW) {
        y -= 2;
    }
    if(input.KeyA) {
        x -= 2;
    }
    if(input.KeyS) {
        y += 2;
    }
    if(input.KeyD) {
        x += 2;
    }
}

function DrawDxDy() {
    let s = size / map.length;

    let dx = x / s;
    dx -= Math.floor(dx);

    let dy = y / s;
    dy -= Math.floor(dy);

    ctx.beginPath();
    ctx.moveTo(x - dx * s, y);
    ctx.lineTo(x, y);
    ctx.moveTo(x, y - dy * s);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    let rx = 0, ry = 0, sx = 0;

    //Horizontal
    if(Math.sin(angle) < 0.001) { //Looking up
        rx = x - dy / Math.tan(angle) * s;
        ry = y - dy * s;
        sx = 1 / Math.tan(angle) * s;

        for(let i = 0; i < 8; i++) {
            let x = rx - sx * i;
            let y = ry - s * i;

            let px = Math.floor(x / s);
            let py = Math.floor(y / s);

            if(isNaN(px) || isNaN(py) || px >= map.length || py >= map.length || px < 0 || py < 0) break;

            if(map[px][py] === 1 || map[px][py+1] === 1) { //Wall
                FillCircle(new Vector2(rx - sx * i, ry - s * i), 5);
            } else { //Not wall
                StrokeCircle(new Vector2(rx - sx * i, ry - s * i), 5);
            }
        }
    } else if(Math.sin(angle) > -0.001) { //Looking down
        rx = x + (1-dy) / Math.tan(angle) * s;
        ry = y + (1-dy) * s;
        sx = 1 / Math.tan(angle) * s;

        for(let i = 0; i < 8; i++) {
            StrokeCircle(new Vector2(rx + sx * i, ry + s * i), 5);
        }
    } else { //Looking straight

    }
}

function DrawRays() {
    let dir = getVector2FromAngle(angle * (180 / Math.PI));
    dir.Scale(1000);

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x + dir.x, y + dir.y);
    ctx.stroke();
    ctx.closePath();
}

function DrawPlayer() {
    StrokeCircle(new Vector2(x, y), 5)
}

function DrawWalls() {
    ctx.fillStyle = "rgb(255,107,107)"
    for(let x = 0; x < map.length; x++) {
        for(let y = 0; y < map[x].length; y++) {
            if(map[x][y] === 1) {
                let py = y * (size / map[x].length);
                let px = x * (size / map.length);
                ctx.fillRect(px, py, size / map.length, size / map.length)
            }
        }
    }
}

function DrawLines() {
    ctx.beginPath();
    for(let x = 0; x < map.length+1; x++) {
        let px = x * (size / map.length);
        ctx.moveTo(px, 0);
        ctx.lineTo(px, size);
    }
    for(let y = 0; y < map.length+1; y++) {
        let py = y * (size / map[0].length);
        ctx.moveTo(0, py);
        ctx.lineTo(size, py);
    }
    ctx.stroke();
    ctx.closePath();
}