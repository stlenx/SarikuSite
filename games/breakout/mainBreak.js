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
    color: "#616161",
    started: false
}

const ballRadius = 4;
let balls = [{
    x: width / 2,
    y: height - 100,
    color: "#000000",
    vx: 0,
    vy: -0,
    combo: 1
}]

let score = 0;
let HighScore = 0;

savedScore = JSON.parse(localStorage.getItem('pageState'));
if (savedScore !== null) {
    HighScore = savedScore.highScore;
}

let boxes = []

let bricks = []

for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 20; y++) {
        let color = hslToHex(Remap(y, 0,20, 0,130),100,50)
        let posX = Remap(x, 0, 8, 0, width) + 7
        let posY = Remap(y, 0, 10, 150, 300)
        bricks.push(CreateBrick(posX,posY,color,60,5))
    }
}

function frame() {
    Draw()

    UpdateThings()

    Save()

    window.requestAnimationFrame(frame)
}

function Save() {
    localStorage.setItem('pageState', JSON.stringify({
        highScore: HighScore
    }));
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

    boxes.forEach(function(box) {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x,box.y,box.w,box.h);
    })

    ctx.font = "20px Helvetica ";
    ctx.fillStyle = "black";
    ctx.fillText(HighScore,30,20);

    ctx.font = "60px Helvetica ";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(score,width / 2, 60);

    if(balls.length === 0) {
        ctx.font = "60px Helvetica ";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over",width / 2,height / 2);

        ctx.font = "30px Helvetica ";
        ctx.fillStyle = "black";
        ctx.fillText("Again?",width / 2,height / 2 + 50);

        ctx.font = "40px Helvetica ";
        ctx.fillStyle = "black";
        ctx.fillText(`High score: ${HighScore}`,width / 2,height / 2 + 100);
    }

    if(bricks.length === 0) {
        balls.forEach(function(ball) {
            ball.vx = 0;
            ball.vy = 0;
        })
        ctx.font = "60px Helvetica ";
        ctx.fillStyle = "green";
        ctx.fillText("You Win!",width / 2,height / 2);

        ctx.font = "30px Helvetica ";
        ctx.fillStyle = "black";
        ctx.fillText("Again?",width / 2,height / 2 + 50);

        ctx.font = "40px Helvetica ";
        ctx.fillStyle = "black";
        ctx.fillText(`High score: ${HighScore}`,width / 2,height / 2 + 100);
    }
}

function UpdateThings() {
    if(score > HighScore) HighScore = score;
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        if(balls[i].x + ballRadius > width) balls[i].vx *= -1
        if(balls[i].x + ballRadius < 0) balls[i].vx *= -1
        if(balls[i].y + ballRadius < 0) balls[i].vy *= -1
        if(balls[i].y + ballRadius > height) balls.splice(i, 1)
    }
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].y += 3;
        if(boxes[i].y + boxes[i].h / 2 > height) boxes.splice(i, 1)
    }
    CheckCollision()
}

function CheckCollision() {
    balls.forEach(function(ball) {
        if(ball.y + ballRadius > platform.y && ball.y + ballRadius < platform.y + platform.h && ball.x > platform.x && ball.x < platform.x + platform.w) {
            ball.combo = 1;
            let vector = getVector2({x: platform.x + platform.w / 2, y: platform.y}, ball)
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
                score += 100 * ball.combo;
                ball.combo++;
                ball.vy *= -1;
                let random = WeightedRandom([0.1,0.2,0.1,0.2,0.4])
                switch (random) {
                    case 0:
                        boxes.push(CreateBox(bricks[i].x + bricks[i].w / 2,bricks[i].y,'green',10,10,"double"))
                        break;
                    case 1:
                        boxes.push(CreateBox(bricks[i].x + bricks[i].w / 2,bricks[i].y,'red',10,10,"half"))
                        break;
                    case 2:
                        boxes.push(CreateBox(bricks[i].x + bricks[i].w / 2,bricks[i].y,'blue',10,10,"bigger"))
                        break;
                    case 3:
                        boxes.push(CreateBox(bricks[i].x + bricks[i].w / 2,bricks[i].y,'pink',10,10,"smaller"))
                        break;
                }
                bricks.splice(i,1)

            }
        }
    })

    for (let i = 0; i < boxes.length; i++) {
        if(boxes[i].y + boxes[i].w > platform.y && boxes[i].y + boxes[i].w < platform.y + platform.h && boxes[i].x > platform.x && boxes[i].x < platform.x + platform.w) {
            switch (boxes[i].s) {
                case "double":
                    let size = balls.length;
                    for (let p = 0; p < size; p++) {
                        balls.push(CreateBall(balls[p].x,balls[p].y,balls[p].vx * -1, balls[p].vy, balls[p].color))
                    }
                    break;
                case "half":
                    balls.splice(0,Math.floor(balls.length / 2))
                    break;
                case "bigger":
                    platform.w *= 2;
                    break;
                case "smaller":
                    platform.w /= 2;
                    break;
            }
            boxes.splice(i,1)
        }
    }
}

function Restart() {
    platform = {
        x: width / 2 - 150 / 2,
        y: height - 50,
        w: 150,
        h: 10,
        color: "#616161",
        started: false
    }

    balls = [{
        x: width / 2,
        y: height - 100,
        color: "#000000",
        vx: 0,
        vy: -0,
        combo: 1
    }]

    score = 0;

    boxes = []

    bricks = []

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 20; y++) {
            let color = hslToHex(Remap(y, 0,20, 0,130),100,50)
            let posX = Remap(x, 0, 8, 0, width) + 7
            let posY = Remap(y, 0, 10, 150, 300)
            bricks.push(CreateBrick(posX,posY,color,60,5))
        }
    }
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
    if(!platform.started) {
        balls[0].x = platform.x + platform.w / 2
        balls[0].y = platform.y - 10
    }
})

canvas.addEventListener('mousedown', function (e) {
    if(!platform.started) {
        platform.started = true;
        balls[0].vx = 5;
        balls[0].vy = -5;
    }
    if(bricks.length === 0 || balls.length === 0) {
        Restart()
    }
})

function Remap(value, from1, to1, from2, to2) {
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function normalizeWeights(weights){
    let normalized = [], sum = weights.reduce((acc, cur) => (acc + cur))
    weights.forEach((w) => {normalized.push(w / sum)})
    return normalized
}

function WeightedRandom(weights) {
    let w = normalizeWeights(weights), s = 0, random = Math.random()

    for (let i = 0; i < w.length - 1; ++i) {
        s += w[i];
        if (random < s) {
            return i
        }
    }

    return w.length - 1
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function CreateBox(x,y, color, w, h, s) {
    return {
        x,
        y,
        color,
        w,
        h,
        s
    }
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
        vy,
        combo: 1
    }
}

window.requestAnimationFrame(frame)