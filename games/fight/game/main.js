let canvas = document.getElementById("scene");
canvas.setAttribute("width", window.innerHeight)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let background = new Image()
background.src = "../background.jpg";
let FEN = " 10";
let playerID = "-1";

let cringe = new URL(document.location.href);
cringe.searchParams.sort();
let room = cringe.searchParams.get("room");

let domain = "fight.sariku.gay";

const Http = new XMLHttpRequest();
const url=`https://${domain}/games/${room}/join`; //Change to http://fight.sariku.gay/games http://192.168.0.69:6969/games
//192.168.0.69

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        FEN = data.levelRepresentation;
        playerID = data.id;
        console.log(data)
    } else {
        switch (this.status) {
            case 401: //Room is full
                document.getElementById("RoomFull").style.opacity = "1";
                break;
            case 404: //Room does not exist
                document.getElementById("Room404").style.opacity = "1";
                break;

        }
    }

    // end of state change: it can be after some time (async)
};

let players = {}

Http.open("POST", url, false);
Http.send();

////3ssss///1sss2sss///1bbbbbbbb 10
let level = new Level(FEN, canvas.width)
level.LoadSprites("../")

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        for (const id in data.players) {
            let player = data.players[id];

            let translatedPosition = TranslatePosition(new Vector2(player.x, player.y))

            let createdPlayer = new Player(translatedPosition.x, translatedPosition.y, canvas.width, level, "green");
            createdPlayer.left = player.left;
            createdPlayer.right = player.right;
            createdPlayer.down = player.down;
            createdPlayer.action1 = player.action1;
            createdPlayer.up = player.up;
            createdPlayer.vel.x = player.vx;
            createdPlayer.vel.y = player.vy;
            createdPlayer.dir.x = player.dx;
            createdPlayer.dir.y = player.dy;

            players[id] = createdPlayer;
        }
    }

    // end of state change: it can be after some time (async)
};

const updateUrl = `https://${domain}/games/${room}/${playerID}`; //Change to `http://fight.sariku.gay/games/${room}/${playerID}`
Http.open("PUT", updateUrl, false);
Http.setRequestHeader("Content-Type", "application/json")
Http.send(JSON.stringify({
    "Id": 69420,
    "Left": false,
    "Down": false,
    "Right": false,
    "Up": false,
    "Action1": false,
    "X": 0,
    "Y": 0,
    "Vx": 0.0,
    "Vy": 0.0,
    "Dx": 0.0,
    "Dy": 0.0
}));

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        if(data.updateId > lastId) {
            lastId = data.updateId;

            if(Object.keys(players).length !== Object.keys(data.players).length) { // CHANGE THISSSS OMG THE SERVER DOESENT ACTUALLY GIVE YOU PLAYER CLASSES YOU IDIOT
                let newPlayerList = {};

                for (const id in data.players) {
                    let newPlayer = data.players[id];

                    if(id !== playerID) {
                        let translatedPosition = TranslatePosition(new Vector2(newPlayer.x, newPlayer.y))
                        let createdPlayer = new Player(translatedPosition.x, translatedPosition.y, canvas.width, level, "green");
                        createdPlayer.left = newPlayer.left;
                        createdPlayer.right = newPlayer.right;
                        createdPlayer.down = newPlayer.down;
                        createdPlayer.action1 = newPlayer.action1;
                        createdPlayer.up = newPlayer.up;
                        createdPlayer.vel.x = newPlayer.vx;
                        createdPlayer.vel.y = newPlayer.vy;
                        createdPlayer.dir.x = newPlayer.dx;
                        createdPlayer.dir.y = newPlayer.dy;

                        newPlayerList[id] = createdPlayer;
                    }
                }

                newPlayerList[playerID] = players[playerID];

                players = newPlayerList;
            } else {
                for (const id in data.players) {
                    let player = data.players[id];

                    if(id !== playerID) {
                        players[id].left = player.left;
                        players[id].right = player.right;
                        players[id].down = player.down;
                        players[id].action1 = player.action1;
                        let translatedPosition = TranslatePosition(new Vector2(player.x, player.y))
                        players[id].x = translatedPosition.x;
                        players[id].y = translatedPosition.y;
                        players[id].vel.x = player.vx;
                        players[id].vel.y = player.vy;
                    }
                }
            }
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

    for (const id in players) {
        let player = players[id];

        player.Draw()
        player.DebugDraw()
        player.Update(dt)
    }

    if(elapsedMS > 50) {
        Update()
        elapsedMS = 0;
    }

    window.requestAnimationFrame(frame)
}

let lastId = 0;
let nextId = 1;
function Update() {
    let translatedPosition = ConvertToGeneralPositions(new Vector2(players[playerID].x, players[playerID].y))

    Http.open("PUT", updateUrl);
    Http.setRequestHeader("Content-Type", "application/json")
    Http.send(JSON.stringify({
        "Id": nextId++,
        "Left": players[playerID].left,
        "Down": players[playerID].down,
        "Right": players[playerID].right,
        "Up": players[playerID].up,
        "Action1": players[playerID].action1,
        "X": translatedPosition.x,
        "Y": translatedPosition.y,
        "Vx": players[playerID].vel.x,
        "Vy": players[playerID].vel.y,
        "Dx": players[playerID].dir.x,
        "Dy": players[playerID].dir.y
    }));
}

function AddPlayer() {
    
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
        case "KeyW":
            players[playerID].up = true;
            break;
        case "KeyP":
            players[playerID].action1 = true;
            Update()
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
        case "KeyW":
            players[playerID].up = false;
            break;
    }
})

function TranslatePosition(pos) {
    pos.x = Remap(pos.x, 0, 1000, 0, canvas.width)
    pos.y = Remap(pos.y, 0, 1000, 0, canvas.width)

    return pos;
}

function ConvertToGeneralPositions(pos) {
    pos.x = Remap(pos.x, 0, canvas.width, 0, 1000)
    pos.y = Remap(pos.y, 0, canvas.width, 0, 1000)

    return pos;
}

window.requestAnimationFrame(frame)