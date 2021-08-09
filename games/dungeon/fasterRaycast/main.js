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
    DrawLines();

    DrawPlayer();

    DrawRays();

    if(input.KeyA) {
        angle -= 2;
    }

    if(input.KeyD) {
        angle += 2;
    }
}

function DrawRays() {
    let dir = getVector2FromAngle(angle);
    dir.Scale(100);

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x + dir.x, y + dir.y);
    ctx.stroke();
    ctx.closePath();

}

function DrawPlayer() {
    StrokeCircle(new Vector2(x, y), 5)
}

function DrawLines() {
    ctx.beginPath();
    for(let x = 0; x < map.length+1; x++) {
        let px = x * (size / map.length) + 10;
        ctx.moveTo(px, 10);
        ctx.lineTo(px, size + 10);
    }
    for(let y = 0; y < map.length+1; y++) {
        let py = y * (size / map[0].length);
        ctx.moveTo(10, py + 10);
        ctx.lineTo(size + 10, py + 10);
    }
    ctx.stroke();
    ctx.closePath();
}