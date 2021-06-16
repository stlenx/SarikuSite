let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let background = new Image()
background.src = "../background.jpg";
let FEN = " 10";
let playerID = "0";

let cringe = new URL(document.location.href);
cringe.searchParams.sort();
let room = cringe.searchParams.get("room");

let domain = "fight.sariku.gay";

let saveData = JSON.parse(localStorage.getItem('useLocalIp'));
if (saveData !== null) domain = "192.168.0.69:6969";

const Http = new XMLHttpRequest();
const url=`http://${domain}/games/${room}/join`; //Change to http://fight.sariku.gay/games http://192.168.0.69:6969/games
//192.168.0.69

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        FEN = data.levelRepresentation;
        playerID = data.id;
        console.log(data)
    }

    // end of state change: it can be after some time (async)
};

//.send(JSON.stringify({
//     value: value
// }));

let players = []

Http.open("POST", url, false);
Http.send();

////3ssss///1sss2sss///1bbbbbbbb 10
let level = new Level(FEN, canvas.width)
level.LoadSprites("../")

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        data.forEach((player) => {
            let createdPlayer = new Player(player.x,player.y, canvas.width, level, "green");
            createdPlayer.left = player.left;
            createdPlayer.right = player.right;
            createdPlayer.down = player.down;
            createdPlayer.vel.x = player.vx;
            createdPlayer.vel.y = player.vy;
            players.push(createdPlayer)
        })
    }

    // end of state change: it can be after some time (async)
};

const updateUrl = `http://${domain}/games/${room}/${playerID}`; //Change to `http://fight.sariku.gay/games/${room}/${playerID}`
Http.open("PUT", updateUrl, false);
Http.setRequestHeader("Content-Type", "application/json")
Http.send(JSON.stringify({
    "Left": false,
    "Down": false,
    "Right": false,
    "X": 0,
    "Y": 0,
    "Vx": 0.0,
    "Vy": 0.0
}));

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        for(let i = 0; i < data.length; i++) {
            if(i >= players.length) {
                let createdPlayer = new Player(data[i].x,data[i].y, canvas.width, level, "green");
                players.push(createdPlayer)
            }

            players[i].left = data[i].left;
            players[i].right = data[i].right;
            players[i].down = data[i].down;
            players[i].x = data[i].x;
            players[i].y = data[i].y;
            players[i].vel.x = data[i].vx;
            players[i].vel.y = data[i].vy;
        }
    }

    // end of state change: it can be after some time (async)
};

let elapsedMS = 0;
let lastFrame = Date.now()
function frame() {
    let now = Date.now()
    let dt = now - lastFrame;
    lastFrame = now
    elapsedMS += dt;

    ctx.drawImage(background, 0,0, canvas.height * (background.width / background.height), canvas.height)

    level.Draw()

    players.forEach((player) => {
        player.Draw()
        player.DebugDraw()
        player.Update(dt)
    })

    if(elapsedMS > 100) {
        Http.open("PUT", updateUrl);
        Http.setRequestHeader("Content-Type", "application/json")
        Http.send(JSON.stringify({
            "Left": players[playerID].left,
            "Down": players[playerID].down,
            "Right": players[playerID].right,
            "X": players[playerID].x,
            "Y": players[playerID].y,
            "Vx": players[playerID].vel.x,
            "Vy": players[playerID].vel.y
        }));

        elapsedMS = 0;
    }

    window.requestAnimationFrame(frame)
}

window.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "Space":
            players[playerID].Jump();
            break;
        case "KeyA":
            players[playerID].left = true;
            break;
        case "KeyD":
            players[playerID].right = true;
            break;
        case "KeyS":
            players[playerID].down = true;
            break;
    }
})

window.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyA":
            players[playerID].left = false;
            break;
        case "KeyD":
            players[playerID].right = false;
            break;
        case "KeyS":
            players[playerID].down = false;
            break;
    }
})

window.requestAnimationFrame(frame)

function UseLocal() {
    localStorage.setItem('useLocalIp', true);
}

function UseOnline() {
    localStorage.clear();
}