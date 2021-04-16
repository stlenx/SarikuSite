let canvas = document.getElementById("canvas")

let check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

let platformW = 150;
let platform;

let height
let width

let ballRadius
let boxSize

let menu

//Set sizes for things accordingly depending on phone or desktop
if(check) {
    //PHONE
    //Set canvas size to be the whole screen
    canvas.setAttribute('width', window.innerWidth - 18);
    canvas.setAttribute('height', window.innerHeight - 15);

    ballRadius = 7;
    boxSize = 20;
    height = canvas.height;
    width = canvas.width;

} else {
    //DESKTOP
    //Set canvas size to be 31.25% of the screen
    canvas.setAttribute('width', window.innerWidth * 0.3125);
    canvas.setAttribute('height', window.innerHeight - 18);

    ballRadius = 4;
    boxSize = 10;
    height = canvas.height;
    width = canvas.width;
}

menu = {
    on: false,
    x: width - width * 0.0833 - 10,
    y: 10,
    w: width * 0.0833,
    h: width * 0.0833,
    ox: width / 2 - (width * 0.8) / 2,
    oy: height / 2 - (height * 0.5) / 2,
    ow: width * 0.8,
    oh: height * 0.5,
    elements: [
        {
            id: "close",
            x: 0,
            y: 0,
            w: 50,
            h: 50,
            color: "red",
            text: "Close"
        }
    ]
}

//Platform values are the same on both versions
platformW = width * 0.25;
platform = {
    x: width / 2 - platformW / 2,
    y: height - 50,
    w: platformW,
    h: platformW * 0.0666,
    color: "#616161",
    started: false
}

ctx = canvas.getContext('2d');
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

savedScore = JSON.parse(localStorage.getItem('saveData'));
if (savedScore !== null) {
    HighScore = savedScore.highScore;
}

let boxes = []

let bricks = []

//Create bricks
for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 20; y++) {
        let color = hslToHex(Remap(y, 0,20, 0,130),100,50)
        let posX = Remap(x, 0, 8, 0, width) + 7
        let posY = Remap(y, 0, 10, 150, 300)
        bricks.push(CreateBrick(posX,posY,color,width * 0.1,5))
    }
}

function frame() {
    Draw()

    if(!menu.on) {
        UpdateThings()
    }

    Save()

    window.requestAnimationFrame(frame)
}

function Save() {
    localStorage.setItem('saveData', JSON.stringify({
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
        if(score > HighScore) HighScore = score;
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

    if(!menu.on) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(menu.x,menu.y,menu.w,menu.h);
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(menu.ox,menu.oy,menu.ow,menu.oh);

        menu.elements.forEach(function (el){
            ctx.fillStyle = el.color;
            ctx.fillRect(menu.ox + el.x,menu.oy + el.y,el.w,el.h);

            //ctx.font = "40px Helvetica ";
            //ctx.fillStyle = "black";
            //ctx.fillText(el.text,menu.ox + el.x,menu.oy + el.y);
        })
    }
}

function UpdateThings() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        if(balls[i].x + ballRadius > width) {
            balls[i].vx *= -1
            let bounce = new Sound("sounds/bounce.wav");
            bounce.play()
        }
        if(balls[i].x + ballRadius < 0) {
            balls[i].vx *= -1
            let bounce = new Sound("sounds/bounce.wav");
            bounce.play()
        }
        if(balls[i].y + ballRadius < 0) {
            balls[i].vy *= -1
            let bounce = new Sound("sounds/bounce.wav");
            bounce.play()
        }
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
            let bounce = new Sound("sounds/bounce.wav");
            bounce.play()
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
                let destroy = new Sound("sounds/break.wav");
                destroy.play()
                score += 100 * ball.combo;
                ball.combo++;
                ball.vy *= -1;
                let random = WeightedRandom([0.1,0.2,0.1,0.2,0.4])
                switch (random) {
                    case 0:
                        boxes.push(CreateBox(getRandom(bricks[i].x, bricks[i].x + bricks[i].w),bricks[i].y,'green',boxSize,boxSize,"double"))
                        break;
                    case 1:
                        boxes.push(CreateBox(getRandom(bricks[i].x, bricks[i].x + bricks[i].w),bricks[i].y,'red',boxSize,boxSize,"half"))
                        break;
                    case 2:
                        boxes.push(CreateBox(getRandom(bricks[i].x, bricks[i].x + bricks[i].w),bricks[i].y,'blue',boxSize,boxSize,"bigger"))
                        break;
                    case 3:
                        boxes.push(CreateBox(getRandom(bricks[i].x, bricks[i].x + bricks[i].w),bricks[i].y,'pink',boxSize,boxSize,"smaller"))
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
    x: width / 2 - platformW / 2,
    y: height - 50,
    w: platformW,
    h: platformW * 0.0666,
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
        bricks.push(CreateBrick(posX,posY,color,width * 0.1,5))
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
    platform.x = Remap(e.offsetX, 20, width - 20, -5, width - (platform.w + 5));
    if(!platform.started) {
        balls[0].x = platform.x + platform.w / 2
        balls[0].y = platform.y - 10
    }
})

document.addEventListener('touchmove', function(e) {
    platform.x = Remap(e.changedTouches[0].pageX, 20, width - 20, -5, width - (platform.w + 5));
    if(!platform.started) {
        balls[0].x = platform.x + platform.w / 2
        balls[0].y = platform.y - 10
    }
}, false);

canvas.addEventListener('mousedown', function (e) {
    if(!platform.started) {
        platform.started = true;
        balls[0].vx = 5;
        balls[0].vy = -5;

        //Cringe plays counter thingy please make better
        let saveData = JSON.parse(localStorage.getItem('saveData'));
        console.log("what")
        if (saveData !== null) {
            if(saveData.plays !== undefined) {
                console.log("what1")
                localStorage.setItem('saveData', JSON.stringify({
                    highScore: HighScore,
                    plays: saveData.plays + 1
                }));
            } else {
                console.log("what2")
                localStorage.setItem('saveData', JSON.stringify({
                    highScore: HighScore,
                    plays: 1
                }));
            }
        } else {
            console.log("How")
            localStorage.setItem('saveData', JSON.stringify({
                highScore: HighScore,
                plays: 1
            }));
        }
    }
    if(bricks.length === 0 || balls.length === 0) {
        Restart()
    }
    if(!menu.on) {
        if(e.offsetX > menu.x && e.offsetX < menu.x + menu.w && e.offsetY > menu.y && e.offsetY < menu.y + menu.h) {
            menu.on = true;
            console.log("i cummed")
        }
    } else {
        menu.elements.forEach(function (el) {
            if(e.offsetX > el.x + menu.ox && e.offsetX < el.x + menu.ox + el.w && e.offsetY > el.y + menu.oy && e.offsetY < el.y + menu.oy + el.h) {
                switch (el.id) {
                    case "close":
                        menu.on = false;
                        break;
                    default:
                        console.log("WHAT THE FUCK DID YOU DO YOU DUMBASS >:(")
                }
            }
        })
    }
})

document.addEventListener('touchend', function(e) {
    if(!platform.started) {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        audio = new AudioContext();
        platform.started = true;
        balls[0].vx = 5;
        balls[0].vy = -5;
    }
    if(bricks.length === 0 || balls.length === 0) {
        Restart()
    }
}, false);

if(check) {
    window.addEventListener("deviceorientation", function(e) {
        e.gamma;
        if(e.gamma > 0) {
            if(platform.x + platform.w < width) platform.x += e.gamma;
        } else {
            if(platform.x > 0) platform.x += e.gamma;
        }
    }, true);
}

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
