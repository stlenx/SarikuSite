let x = 300;
let y = 400;
let angle = 0;

function setup() {
}

function frame() {
    DrawPlayer();

    if(input.KeyQ) {
        angle -= 2;

        if(angle < 0) {
            angle = 360 - angle;
        }
    }

    if(input.KeyE) {
        angle += 2;

        if(angle > 360) {
            angle = 360 - angle;
        }
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

function DrawPlayer() {
    StrokeCircle(new Vector2(x, y), 5);

    let vector = getVector2FromAngle(angle);
    let angle2 = Math.atan2(vector.x, vector.y);
    angle2 *= (180 / Math.PI);
    angle2 *= -1;
    angle2 += 90;

    console.log(angle2, angle)

    vector.Scale(100)

    StrokeLine(new Vector2(x, y), new Vector2(x + vector.x, y + vector.y));

    vector = getVector2FromAngle(angle2)
    vector.Scale(100)

    StrokeLine(new Vector2(x, y), new Vector2(x + vector.x, y + vector.y));
}