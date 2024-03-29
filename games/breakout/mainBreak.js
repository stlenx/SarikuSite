//#region Init

let canvas = document.getElementById("canvas")
ctx = canvas.getContext('2d');

let check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

//#region Phone/Desktop canvas config
let ballRadius, boxSize

//Set sizes for things accordingly depending on phone or desktop
if(check) {
    //PHONE
    //Set canvas size to be the whole screen
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    ballRadius = 7;
    boxSize = 20;
} else {
    //DESKTOP
    //Set the canvas to the correct aspect ratio
    let width = window.innerHeight * 0.630914826 > window.innerWidth ? window.innerWidth : window.innerHeight * 0.630914826
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', window.innerHeight);

    ballRadius = 4;
    boxSize = 10;
}

let height = canvas.height, width = canvas.width, volume = 0.5, shadows = true, hardMode = false;
//#endregion

let menu = new Menu(
    width - width * 0.0833 - 10,
    10,
    width * 0.0833,
    width * 0.0833,
    "rgba(255,255,255,0.8)",
    "rgba(255,255,255,0.8)",
    "Menu",
    width / 2 - (width * 0.8) / 2,
    height / 2 - (height * 0.5) / 2,
    width * 0.8,
    height * 0.5
)

menu.AddElement(new MenuElement(
    "close",
    width * 0.8 - width * 0.0833 - 5,
    5,
    width * 0.0833,
    width * 0.0833,
    "red",
    "✖",
    width * 0.0666,
    width * 0.8 - width * 0.0833 - 5 + width * 0.0666 / 4,
    5 + width * 0.0666,
    "button"
))

menu.AddElement(new MenuElement(
    "resetScore",
    5,
    width * 0.1,
    16 * width * 0.0416 * 0.52,
    width * 0.0416 * 1.4,
    "rgba(220,220,220,0.86)",
    "Reset High Score",
    width * 0.0416,
    10,
    width * 0.1 + width * 0.0416,
    "button"
))

menu.AddElement(new MenuElement(
    "plays",
    0,
    0,
    0,
    0,
    "rgba(196,196,196,0)",
    "Times played: ",
    width * 0.0416,
    10,
    height * 0.5 - 15,
    "text"
))

menu.AddElement(new MenuElement(
    "volume",
    5,
    width * 0.2,
    width * 0.8 - 10,
    width * 0.0416 * 1.4,
    "rgba(220,220,220,0)",
    "Volume",
    width * 0.0416,
    10,
    width * 0.2 + width * 0.0416,
    "slider",
    0.5
))

menu.AddElement(new MenuElement(
    "hardMode",
    width * 0.0416 * 7,
    width * 0.3 + 5,
    width * 0.0833,
    width * 0.05,
    "rgba(71,71,71,1)",
    "Hard mode ",
    width * 0.0416,
    10,
    width * 0.3 + width * 0.0416,
    "check",
    hardMode
))

menu.AddElement(new MenuElement(
    "shadows",
    width * 0.0416 * 7,
    width * 0.4 + 5,
    width * 0.0833,
    width * 0.05,
    "rgba(71,71,71,1)",
    "Shadows ",
    width * 0.0416,
    10,
    width * 0.4 + width * 0.0416,
    "check",
    shadows
))

menu.AddElement(new MenuElement(
    "back",
    5,
    width * 0.5,
    10 * width * 0.0416 * 0.52,
    width * 0.0416 * 1.4,
    "rgba(220,220,220,0.86)",
    "Quit game",
    width * 0.0416,
    10,
    width * 0.5 + width * 0.0416,
    "button"
))

let platform = new Platform(width, height)

let balls = [new Ball(width / 2, height - 100, "#000000", new Vector2(0,0), ballRadius)]

let score = 0, HighScore = 0, plays = 1, volumeClicked = false;

let lastTick = Date.now();

let saveData = JSON.parse(localStorage.getItem('saveData'));
if (saveData !== null && saveData.shadows !== undefined) shadows = saveData.shadows
if (saveData !== null && saveData.shadows !== undefined) hardMode = saveData.hardMode
if (saveData !== null && saveData.highScore !== undefined) HighScore = saveData.highScore

let boxes = [], bricks = [];

//Create bricks
for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 20; y++) {
        let color = hslToHex(Remap(y, 0,20, 0,130),100,50)
        let posX = Remap(x, 0, 8, 0, width) + width * 0.0116
        let posY = Remap(y, 0, 10, 150, 300)
        bricks.push(new Brick(posX, posY, color, width * 0.1, width * 0.008333))
    }
}

new Sound("sounds/bounce.wav", volume);

//#endregion Init

function frame() {

    let now = Date.now()
    let delta = now - lastTick;
    lastTick = now;

    if(document.hasFocus()) {

        Draw()

        //If the menu is open pause the game
        if(!menu.on) {
            UpdateThings(delta)
        }

        Save()
    }

    window.requestAnimationFrame(frame)
}

function Save() {

    let saveData = JSON.parse(localStorage.getItem('saveData'));
    if (saveData !== null && saveData.plays !== undefined) plays = saveData.plays
    if (saveData !== null && saveData.volume !== undefined) volume = saveData.volume

    localStorage.setItem('saveData', JSON.stringify({
        highScore: HighScore,
        plays: plays,
        volume: volume,
        shadows: shadows,
        hardMode: hardMode
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
    platform.Draw()

    //Draw bricks
    bricks.forEach((brick) => {
        brick.Draw()
    })

    //Draw balls
    balls.forEach((ball) => {
        ball.Draw()
    })

    //Draw boxes
    boxes.forEach((box) => {
        box.Draw()
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
            ball.ResetSpeed()
        })

        ctx.font = "60px Helvetica";
        ctx.fillStyle = "green";
        ctx.fillText("You Win!",width / 2,height / 2);

        ctx.font = "30px Helvetica";
        ctx.fillStyle = "black";
        ctx.fillText("Again?",width / 2,height / 2 + 50);

        ctx.font = "40px Helvetica";
        ctx.fillText(`High score: ${HighScore}`,width / 2,height / 2 + 100);
    }

    //Draw menu - ALWAYS LEAVE THIS AS LAST
    menu.Draw()
}

function UpdateThings(dt) {
    for (let i = 0; i < balls.length; i++) {
        balls[i].AddSpeed(dt)

        //Check for collisions
        balls[i].Wall()
        if(balls[i].y + ballRadius > height) balls.splice(i, 1)
    }
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].y += 3 * (dt / 16);
        if(boxes[i].y + boxes[i].h / 2 > height) boxes.splice(i, 1)
    }
    CheckCollision()
}

function CheckCollision() {
    balls.forEach(function(ball) {
        if(ball.y + ballRadius > platform.y && ball.y + ballRadius < platform.y + platform.h && ball.x > platform.x && ball.x < platform.x + platform.w) {
            ball.PlatformCollide()
        }
        //Second bullshit check
        let x1 = ball.lx;
        let y1 = ball.ly;
        let x2 = ball.x;
        let y2 = ball.y;
        let x3 = platform.x;
        let y3 = platform.y;
        let x4 = platform.x + platform.w;
        let y4 = platform.y;

        let D = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        let Px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / D;

        if(Px > platform.x && Px < platform.x + platform.w && platform.y > ball.ly && platform.y < ball.y) {
            ball.PlatformCollide()
        }

        for (let i = 0; i < bricks.length; i++) {
            if(ball.BrickCollide(i)) {
                let random = WeightedRandom([0.1,0.2,0.1,0.2,0.4]);
                if(hardMode) {
                    random = WeightedRandom([0.1,0.3,0.1,0.3,0.4]);
                }
                switch (random) {
                    case 0:
                        boxes.push(new Box(getRandom(bricks[i].x, bricks[i].x + bricks[i].w), bricks[i].y, 'green', boxSize, "double"))
                        break;
                    case 1:
                        boxes.push(new Box(getRandom(bricks[i].x, bricks[i].x + bricks[i].w), bricks[i].y, 'red', boxSize, "half"))
                        break;
                    case 2:
                        boxes.push(new Box(getRandom(bricks[i].x, bricks[i].x + bricks[i].w), bricks[i].y, 'blue', boxSize, "bigger"))
                        break;
                    case 3:
                        boxes.push(new Box(getRandom(bricks[i].x, bricks[i].x + bricks[i].w), bricks[i].y, 'pink', boxSize, "smaller"))
                        break;
                }
                bricks.splice(i,1)
                if(bricks.length === 0) new Sound("sounds/win.wav", volume).play();
            }
        }
    })

    for (let i = 0; i < boxes.length; i++) {
        if(CheckBoxCollision(boxes[i], platform)) {
            switch (boxes[i].s) {
                case "double":
                    let size = balls.length;
                    for (let p = 0; p < size; p++) {
                        balls.push(new Ball(balls[p].x, balls[p].y, balls[p].color, new Vector2(balls[p].v.x * -1, balls[p].v.y), ballRadius))
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
    platform = new Platform(width, height)
    balls = [new Ball(width / 2, height - 100, "#000000", new Vector2(0,0), ballRadius)]

    score = 0;
    boxes = [];
    bricks = [];

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 20; y++) {
            let color = hslToHex(Remap(y, 0,20, 0,130),100,50)
            let posX = Remap(x, 0, 8, 0, width) + 7
            let posY = Remap(y, 0, 10, 150, 300)
            bricks.push(new Brick(posX, posY, color, width * 0.1, 5))
        }
    }
}

//#region Event Listeners

canvas.addEventListener('mousedown', (e) => {
    //If the menu is not on, then do game shit. Otherwise, do menu shit
    if(!menu.on) {
        //If you click on the menu, open the menu
        if(e.offsetX > menu.x && e.offsetX < menu.x + menu.w && e.offsetY > menu.y && e.offsetY < menu.y + menu.h) {
            menu.on = true;
            return;
        }
        //If the game hasn't started, start the game
        if(!platform.started) {
            platform.Start()
        }
        //If you won/lost, restart the game
        if(bricks.length === 0 || balls.length === 0) {
            Restart()
        }
        return;
    }
    menu.elements.forEach(function (element) {
        //Check if you click with your mouse and then do the do
        if(element.ClickCheck(e.offsetX, e.offsetY)) {
            switch (element.id) {
                case "close":
                    menu.on = false;
                    break;
                case "resetScore":
                    HighScore = 0;
                    break;
                case "volume":
                    volumeClicked = true
                    break;
                case "hardMode":
                    menu.elements[4].value = !menu.elements[4].value;
                    hardMode = !hardMode;
                    Restart()
                    break;
                case "shadows":
                    menu.elements[5].value = !menu.elements[5].value;
                    shadows = !shadows;
                    break;
                case "back":
                    location.href = "../index.html";
                    break;
                default:
                    console.log("WHAT THE FUCK DID YOU DO YOU DUMBASS >:(")
            }
        }
    })
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
                volume: volume,
                shadows: shadows,
                hardMode: hardMode
            }));
        }
    }
})

document.addEventListener('mouseup', (e) => {
    if(volumeClicked) volumeClicked = false;
})

document.addEventListener('touchstart', (e) => {
    if(menu.elements[3].ClickCheck(e.changedTouches[0].pageX, e.changedTouches[0].pageY)) volumeClicked = true
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
                volume: volume,
                shadows: shadows,
                hardMode: hardMode
            }));
        }
    }
}, false);

document.addEventListener('touchend', (e) => {
    if(!platform.started) {
        platform.Start()
    }
    if(bricks.length === 0 || balls.length === 0) Restart()
    if(volumeClicked) volumeClicked = false;
}, false);

if(check) {
    window.addEventListener("deviceorientation", (e) => {
        if(platform.x + platform.w < width && platform.x > 0) platform.x += e.gamma;
    }, true);
}

//#endregion

window.onresize = () => {
    console.log("resize")
    if(check) {
        //PHONE
        canvas.setAttribute('width', window.innerWidth);
    } else {
        //DESKTOP
        let width = window.innerHeight * 0.630914826 > window.innerWidth ? window.innerWidth : window.innerHeight * 0.630914826
        canvas.setAttribute('width', width);
    }
    canvas.setAttribute('height', window.innerHeight);
};

window.requestAnimationFrame(frame)
