let canvas = document.getElementById("canvas")
canvas.setAttribute('width', 600);
canvas.setAttribute('height', window.innerHeight - 18);
ctx = canvas.getContext('2d');

let height = canvas.height;
let width = canvas.width;

let platform = {
    x: width / 2 - 150 / 2,
    y: height - 50,
    w: 150,
    h: 10,
    color: "#616161"
}

const ballRadius = 4;
let balls = [{
    x: width / 2,
    y: height - 100,
    color: "#000000",
    vx: 5,
    vy: -5
}]

let bricks = []

for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 10; y++) {
        let posX = Remap(x, 0, 8, 0, width) + 7
        let posY = Remap(y, 0, 10, 150, 300)
        bricks.push(CreateBrick(posX,posY,"red",60,5))
    }
}

function frame() {
    Draw()

    UpdateBalls()

    window.requestAnimationFrame(frame)
}

function Draw() {
    //ctx.clearRect(0, 0, width, height)
    //ctx.fillStyle = 'red';
    //ctx.fillRect(0,0,width, height)

    // Create gradient
    let grd = ctx.createLinearGradient(0,0,0,height);
    grd.addColorStop(0,"#75e3ff");
    grd.addColorStop(1,"#e6f7ff");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,width,height);

    // Draw player platform
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x,platform.y,platform.w,platform.h);

    bricks.forEach(function (brick) {
        // Draw each brick on the screen)
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x,brick.y,brick.w,brick.h);
    })

    balls.forEach(function(ball) {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    })

    if(balls.length === 0) {
        ctx.font = "60px Helvetica ";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over",width / 2,height / 2);
    }

    if(bricks.length === 0) {
        balls.forEach(function(ball) {
            ball.vx = 0;
            ball.vy = 0;
        })
        ctx.font = "60px Helvetica ";
        ctx.textAlign = "center";
        ctx.fillStyle = "green";
        ctx.fillText("You Win!",width / 2,height / 2);
    }
}

function UpdateBalls() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        if(balls[i].x + ballRadius > width) balls[i].vx *= -1
        if(balls[i].x + ballRadius < 0) balls[i].vx *= -1
        if(balls[i].y + ballRadius < 0) balls[i].vy *= -1
        if(balls[i].y + ballRadius > height) balls.splice(i, 1)
    }
    CheckCollision()
}

function CheckCollision() {
    balls.forEach(function(ball) {
        if(ball.y + ballRadius > platform.y && ball.y + ballRadius < platform.y + platform.h && ball.x > platform.x && ball.x < platform.x + platform.w) {
            let vector = getVector2({x: platform.x + platform.w / 2, y: platform.y}, ball)
            ////vector.normalize()
            //console.log(vector)
            //ball.vx *= vector.x / 10;
            ball.vy *= -1;
            if(ball.x < platform.x + platform.w / 2) {
                if(ball.vx > 0) {
                    ball.vx *= -1;
                    ball.vx -= vector.x / 10;
                } else {
                    ball.vx -= vector.x / 10;
                }
            } else {
                if(ball.vx < 0) {
                    ball.vx *= -1;
                    ball.vx += vector.x / 10;
                } else {
                    ball.vx += vector.x / 10;
                }
            }
        }
        for (let i = 0; i < bricks.length; i++) {
            let condition1 = ball.y + ballRadius > bricks[i].y;
            let condition2 = ball.y - ballRadius < bricks[i].y + bricks[i].h;
            let condition3 = ball.x + ballRadius > bricks[i].x;
            let condition4 = ball.x - ballRadius < bricks[i].x + bricks[i].w;
            if(condition1 && condition2 && condition3 && condition4) {
                ball.vy *= -1;
                bricks.splice(i,1)
            }
        }
    });
}

document.addEventListener('keydown', function (e) {
    //console.log(e.code)
    switch (e.code) {
        case "KeyD":
            if(platform.x + platform.w < width) platform.x += 10;
            break;
        case "KeyA":
            if(platform.x > 0) platform.x -= 10;
            break;
    }
});

canvas.addEventListener('mousemove', function (e) {
    platform.x = Remap(e.offsetX, 0, width, 0, width - platform.w);
})

function Remap(value, from1, to1, from2, to2) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function CreateBrick(x,y, color, w, h) {
    return {
        x,
        y,
        color,
        w,
        h
    }
}

function CreateBall(x,y,vx,vy, color) {
    return {
        x,
        y,
        color,
        vx,
        vy
    }
}

window.requestAnimationFrame(frame)