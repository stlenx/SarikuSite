//#region Init

let canvas = document.getElementById("canvas")
ctx = canvas.getContext('2d');

let check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

//#region Phone/Desktop canvas config

let platformW = 150, platform, ballRadius, boxSize

//Set sizes for things accordingly depending on phone or desktop
if(check) {
    //PHONE
    //Set canvas size to be the whole screen
    canvas.setAttribute('width', window.innerWidth - 18);
    canvas.setAttribute('height', window.innerHeight - 15);

    ballRadius = 7;
    boxSize = 20;

} else {
    //DESKTOP
    //Set canvas size to be 31.25% of the screen
    canvas.setAttribute('width', window.innerWidth * 0.3125);
    canvas.setAttribute('height', window.innerHeight - 18);

    ballRadius = 4;
    boxSize = 10;
}

let height = canvas.height, width = canvas.width, volume = 0.5;
//#endregion

let menu = {
    on: false,
    x: width - width * 0.0833 - 10,
    y: 10,
    w: width * 0.0833,
    h: width * 0.0833,
    color: "rgba(255,255,255,0.8)",
    ocolor: "rgba(255,255,255,0.8)",
    text: "Menu",
    ox: width / 2 - (width * 0.8) / 2,
    oy: height / 2 - (height * 0.5) / 2,
    ow: width * 0.8,
    oh: height * 0.5,
    elements: [
        {
            id: "close",
            x: width * 0.8 - width * 0.0833 - 5,
            y: 5,
            w: width * 0.0833,
            h: width * 0.0833,
            color: "red",
            text: "✖",
            textSize: width * 0.0666,
            tx: width * 0.8 - width * 0.0833 - 5 + width * 0.0666 / 4,
            ty: 5 + width * 0.0666
        },
        {
            id: "resetScore",
            x: 5,
            y: width * 0.1,
            w: 16 * width * 0.0416 * 0.52,
            h: width * 0.0416 * 1.4,
            color: "rgba(220,220,220,0.86)",
            text: "Reset High Score",
            textSize: width * 0.0416,
            tx: 10,
            ty: width * 0.1 + width * 0.0416
        },
        {
            id: "plays",
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            color: "rgba(196,196,196,0)",
            text: "Times played: ",
            textSize: width * 0.0416,
            tx: 10,
            ty: height * 0.5 - 15
        },
        {
            id: "volume",
            value: 0.5,
            x: 5,
            y: width * 0.2,
            w:  width * 0.8 - 10,
            h: width * 0.0416 * 1.4,
            color: "rgba(220,220,220,0)",
            text: "Volume",
            textSize: width * 0.0416,
            tx: 10,
            ty: width * 0.2 + width * 0.0416
        },
        {
            id: "hardMode",
            value: false,
            x: width * 0.0416 * 7,
            y: width * 0.3 + 5,
            w: width * 0.0833,
            h: width * 0.05,
            color: "rgba(71,71,71,1)",
            text: "Hard mode ",
            textSize: width * 0.0416,
            tx: 10,
            ty: width * 0.3 + width * 0.0416
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

let balls = [{
    x: width / 2,
    y: height - 100,
    color: "#000000",
    vx: 0,
    vy: 0,
    combo: 1
}]

let score = 0, HighScore = 0, plays = 1, volumeClicked = false, hardMode = false;

savedScore = JSON.parse(localStorage.getItem('saveData'));
if (savedScore !== null) {
    HighScore = savedScore.highScore;
}

let boxes = [], bricks = [];

//Create bricks
for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 20; y++) {
        let color = hslToHex(Remap(y, 0,20, 0,130),100,50)
        let posX = Remap(x, 0, 8, 0, width) + 7
        let posY = Remap(y, 0, 10, 150, 300)
        bricks.push(CreateBrick(posX,posY,color,width * 0.1,5))
    }
}

new Sound("sounds/bounce.wav", volume);

//#endregion Init

function frame() {
    Draw()

    //If the menu is open pause the game
    if(!menu.on) {
        UpdateThings()
    }

    Save()

    window.requestAnimationFrame(frame)
}

function Save() {

    let saveData = JSON.parse(localStorage.getItem('saveData'));
    if (saveData !== null && saveData.plays !== undefined) plays = saveData.plays
    if (saveData !== null && saveData.volume !== undefined) volume = saveData.volume

    localStorage.setItem('saveData', JSON.stringify({
        highScore: HighScore,
        plays: plays,
        volume: volume
    }));
}

function Draw() {

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

    //Draw bricks
    bricks.forEach(function (brick) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x,brick.y,brick.w,brick.h);
    })

    //Draw balls
    balls.forEach(function(ball) {
        ctx.fillStyle = ball.color;
        let circle = new Path2D()
        circle.arc(ball.x, ball.y, ballRadius, 0, Math.PI*2);
        ctx.fill(circle);
    })

    //Draw boxes
    boxes.forEach(function(box) {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x,box.y,box.w,box.h);
    })

    //Draw UI
    ctx.font = "20px Helvetica ";
    ctx.textAlign = "start";
    ctx.fillStyle = "black";
    ctx.fillText(HighScore,5,20);

    ctx.font = "60px Helvetica ";
    ctx.textAlign = "center";
    ctx.fillText(score,width / 2, 60);

    //If there's no more balls you lost
    if(balls.length === 0) {
        ctx.font = "60px Helvetica ";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over",width / 2,height / 2);

        ctx.font = "30px Helvetica ";
        ctx.fillStyle = "black";
        ctx.fillText("Again?",width / 2,height / 2 + 50);

        ctx.font = "40px Helvetica ";
        ctx.fillText(`High score: ${HighScore}`,width / 2,height / 2 + 100);
    }

    //If there's no more bricks you won
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
        ctx.fillText(`High score: ${HighScore}`,width / 2,height / 2 + 100);
    }

    //Draw menu - ALWAYS LEAVE THIS AS LAST OR CHANGE TO ELSE
    if(!menu.on) {
        ctx.fillStyle = menu.color;
        ctx.fillRect(menu.x,menu.y,menu.w,menu.h);
        return;
    }
    //Draw open menu
    ctx.fillStyle = menu.ocolor;
    ctx.fillRect(menu.ox,menu.oy,menu.ow,menu.oh);

    ctx.font = "40px Helvetica ";
    ctx.fillStyle = "black";
    ctx.fillText(menu.text,menu.ox + menu.ow / 2, menu.oy + 40);

    menu.elements.forEach((el) => {
        ctx.fillStyle = el.color;
        ctx.fillRect(menu.ox + el.x,menu.oy + el.y,el.w,el.h);

        let plays = 1;
        switch (el.id) {
            case "plays":
                let data = JSON.parse(localStorage.getItem('saveData'));
                if (data !== null) {
                    plays = data.plays;
                }
                el.text = `Times played: ${plays}`;
                break;
            case "volume":
                ctx.fillStyle = "rgb(71,71,71)";
                ctx.fillRect(menu.ox + el.x + width * 0.18,menu.oy + el.y + el.h / 2 - 2,el.w - width * 0.21,4);

                let pos = (el.w - width * 0.21) * volume;
                ctx.fillStyle = "rgb(0,180,255)";
                ctx.fillRect(menu.ox + el.x + width * 0.18,menu.oy + el.y + el.h / 2 - 2,pos,4);

                ctx.fillStyle = "rgb(170,170,170)";
                let volumeCircle = new Path2D()
                volumeCircle.arc(menu.ox + el.x + width * 0.18 + pos, menu.oy + el.y + el.h / 2, 10, 0, Math.PI*2)
                ctx.fill(volumeCircle);

                ctx.fillStyle = "rgb(208,208,208)";
                volumeCircle = new Path2D()
                volumeCircle.arc(menu.ox + el.x + width * 0.18 + pos, menu.oy + el.y + el.h / 2, 8, 0, Math.PI*2);
                ctx.fill(volumeCircle);
                break;
            case "hardMode":
                let hardCircleL = new Path2D()
                hardCircleL.arc(el.x + menu.ox,el.y + menu.oy + el.h / 2,el.h / 2,0,Math.PI * 2)

                let hardCircleR = new Path2D()
                hardCircleR.arc(el.x + menu.ox + el.w, el.y + menu.oy + el.h / 2, el.h / 2, 0, Math.PI * 2)

                if(el.value) {
                    el.color = "rgba(0,180,255,1)";

                    ctx.fillStyle = "rgb(0,180,255)";
                    ctx.fill(hardCircleL)

                    ctx.fillStyle = "rgb(208,208,208)";
                    ctx.fill(hardCircleR)
                } else {
                    el.color = "rgba(71,71,71,1)";

                    ctx.fillStyle = "rgb(208,208,208)";
                    ctx.fill(hardCircleL)

                    ctx.fillStyle = "rgb(71,71,71)";
                    ctx.fill(hardCircleR)
                }
                break;
            default:
                break;
        }

        ctx.font = `${el.textSize}px Helvetica`;
        ctx.fillStyle = "black";
        ctx.textAlign = "start";
        ctx.fillText(el.text,menu.ox + el.tx,menu.oy + el.ty);
    })
}

function UpdateThings() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;

        //Check for collisions
        if(balls[i].x + ballRadius > width && balls[i].vx > 0) {
            balls[i].vx *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
        if(balls[i].x + ballRadius < 0 && balls[i].vx < 0) {
            balls[i].vx *= -1
            new Sound("sounds/bounce.wav", volume).play();
        }
        if(balls[i].y + ballRadius < 0 && balls[i].vy < 0) {
            balls[i].vy *= -1
            new Sound("sounds/bounce.wav", volume).play();
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
            if(ball.vy > 0) ball.vy *= -1
            let vector = getVector2({x: platform.x + platform.w / 2, y: platform.y}, ball)
            new Sound("sounds/bounce.wav", volume).play();
            //Fancy ball bounce thingie
            if(ball.x < platform.x + platform.w / 2) {
                if(ball.vx > 0) ball.vx *= -1;
                ball.vx -= vector.x / 10;
            } else {
                if(ball.vx < 0) ball.vx *= -1;
                ball.vx += vector.x / 10;
            }
        }
        for (let i = 0; i < bricks.length; i++) {
            let condition1 = ball.y + ballRadius > bricks[i].y;
            let condition2 = ball.y - ballRadius < bricks[i].y + bricks[i].h;
            let condition3 = ball.x + ballRadius > bricks[i].x;
            let condition4 = ball.x - ballRadius < bricks[i].x + bricks[i].w;
            if(condition1 && condition2 && condition3 && condition4) {
                new Sound("sounds/break.wav", volume).play();
                if(hardMode) {
                    score += 100 * ball.combo * balls.length * 2;
                } else {
                    score += 100 * ball.combo * balls.length;
                }
                ball.combo++;
                ball.vy *= -1;
                let random = WeightedRandom([0.1,0.2,0.1,0.2,0.4]);
                if(hardMode) {
                    random = WeightedRandom([0.1,0.3,0.1,0.3,0.4]);
                }
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
                if(bricks.length === 0) new Sound("sounds/win.wav", volume).play();
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

//#region Event Listeners

canvas.addEventListener('mousedown', (e) => {
    if(!menu.on) {
        if(e.offsetX > menu.x && e.offsetX < menu.x + menu.w && e.offsetY > menu.y && e.offsetY < menu.y + menu.h) {
            menu.on = true;
            return;
        }
        if(!platform.started) {
            platform.started = true;
            //Set velocity of balls if hard mode is enabled or not
            if(hardMode) {
                balls[0].vx = 10;
                balls[0].vy = -10;
            } else {
                balls[0].vx = 5;
                balls[0].vy = -5;
            }

            //Cringe plays counter thingy please make better
            let saveData = JSON.parse(localStorage.getItem('saveData'));
            if (saveData !== null) {
                if(saveData.plays !== undefined) {
                    localStorage.setItem('saveData', JSON.stringify({
                        highScore: HighScore,
                        plays: saveData.plays + 1
                    }));
                    plays = saveData.plays + 1
                } else {
                    localStorage.setItem('saveData', JSON.stringify({
                        highScore: HighScore,
                        plays: 1
                    }));
                }
            } else {
                localStorage.setItem('saveData', JSON.stringify({
                    highScore: HighScore,
                    plays: 1
                }));
            }
        }
        if(bricks.length === 0 || balls.length === 0) {
            Restart()
        }
        return;
    }
    menu.elements.forEach(function (el) {
        if(e.offsetX > el.x + menu.ox && e.offsetX < el.x + menu.ox + el.w && e.offsetY > el.y + menu.oy && e.offsetY < el.y + menu.oy + el.h) {
            switch (el.id) {
                case "close":
                    menu.on = false;
                    break;
                case "resetScore":
                    HighScore = 0;
                    break;
                case "volume":
                    break;
                case "hardMode":
                    break;
                default:
                    console.log("WHAT THE FUCK DID YOU DO YOU DUMBASS >:(")
            }
        }
    })
    let Vx = menu.ox + menu.elements[3].x + 110;
    let Vw = menu.elements[3].w - 130;
    let Vy = menu.oy + menu.elements[3].y + menu.elements[3].h / 2 - 10;
    let Vh = 20
    if(e.offsetX > Vx && e.offsetX < Vx + Vw && e.offsetY > Vy && e.offsetY < Vy + Vh) {
        volumeClicked = true
    }

    let Hx = menu.elements[4].x + menu.ox - menu.elements[4].h / 2;
    let Hw = menu.elements[4].w + menu.elements[4].h / 2;
    let Hy = menu.elements[4].y + menu.oy;
    let Hh = menu.elements[4].h;
    if(e.offsetX > Hx && e.offsetX < Hx + Hw && e.offsetY > Hy && e.offsetY < Hy + Hh) {
        menu.elements[4].value = !menu.elements[4].value;
        hardMode = !hardMode;
        Restart()
    }
})

canvas.addEventListener('mousemove', (e) => {
    platform.x = Remap(e.offsetX, 20, width - 20, -5, width - (platform.w + 5));
    if(!platform.started) {
        balls[0].x = platform.x + platform.w / 2
        balls[0].y = platform.y - 10
    }
    if(volumeClicked) {
        if(e.offsetX > menu.ox + menu.elements[3].x + width * 0.18 && e.offsetX < menu.ox + menu.elements[3].x + width * 0.18 + menu.elements[3].w - width * 0.21) {
            let pos = Remap(e.offsetX,menu.ox + menu.elements[3].x + width * 0.18,menu.ox + menu.elements[3].x + width * 0.18 + menu.elements[3].w - width * 0.21, 0, 100)
            volume = pos / 100;
            localStorage.setItem('saveData', JSON.stringify({
                highScore: HighScore,
                plays: plays,
                volume: volume
            }));
        }
    }
})

document.addEventListener('mouseup', (e) => {
    if(volumeClicked) volumeClicked = false;
})

document.addEventListener('touchstart', (e) => {
    let Vx = menu.ox + menu.elements[3].x + 110;
    let Vw = menu.elements[3].w - 130;
    let Vy = menu.oy + menu.elements[3].y + menu.elements[3].h / 2 - 10;
    let Vh = 20
    if(e.changedTouches[0].pageX > Vx && e.changedTouches[0].pageX < Vx + Vw && e.changedTouches[0].pageY > Vy && e.changedTouches[0].pageY < Vy + Vh) {
        volumeClicked = true
    }
}, false);

document.addEventListener('touchmove', (e) => {
    platform.x = Remap(e.changedTouches[0].pageX, 20, width - 20, -5, width - (platform.w + 5));
    if(!platform.started) {
        balls[0].x = platform.x + platform.w / 2
        balls[0].y = platform.y - 10
    }

    if(volumeClicked) {
        if(e.changedTouches[0].pageX > menu.ox + menu.elements[3].x + width * 0.18 && e.changedTouches[0].pageX < menu.ox + menu.elements[3].x + width * 0.18 + menu.elements[3].w - width * 0.21) {
            let pos = Remap(e.changedTouches[0].pageX,menu.ox + menu.elements[3].x + width * 0.18,menu.ox + menu.elements[3].x + width * 0.18 + menu.elements[3].w - width * 0.21, 0, 100)
            volume = pos / 100;
            localStorage.setItem('saveData', JSON.stringify({
                highScore: HighScore,
                plays: plays,
                volume: volume
            }));
        }
    }
}, false);

document.addEventListener('touchend', (e) => {
    if(!platform.started) {
        platform.started = true;
        balls[0].vx = 5;
        balls[0].vy = -5;
    }
    if(bricks.length === 0 || balls.length === 0) Restart()
    if(volumeClicked) volumeClicked = false;
}, false);

if(check) {
    window.addEventListener("deviceorientation", (e) => {
        if(e.gamma > 0) {
            if(platform.x + platform.w < width) platform.x += e.gamma;
        } else {
            if(platform.x > 0) platform.x += e.gamma;
        }
    }, true);
}

//#endregion

//#region Create Elements

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

//#endregion

window.requestAnimationFrame(frame)