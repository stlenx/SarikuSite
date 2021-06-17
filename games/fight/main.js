let domain = "fight.sariku.gay";

const Http = new XMLHttpRequest();
const url=`https://${domain}/games`; //Change to http://fight.sariku.gay/games http://192.168.0.69:6969/games

Http.onreadystatechange = () => {
    if (Http.readyState !== 4 || Http.status !== 200) return; // Check for ready because xmlhttprequest gae

    let output = JSON.parse(Http.responseText)
    output.forEach(AddRoom)
    console.log(output)
}

function AddRoom(room) {
    let container = document.getElementById("rooms");

    //Make container div
    let roomDiv = document.createElement("div");
    roomDiv.setAttribute("class", "room")
    //roomDiv.innerHTML = room.id;
    roomDiv.onclick = function () {
        location.href = `game/index.html?room=${room.id}`;
    }

    //Make roomId div
    let roomId = document.createElement("div");
    roomId.setAttribute("class", "roomId")
    roomId.innerHTML = room.id;

    let roomPlayers = document.createElement("div");
    roomPlayers.setAttribute("class", "roomPlayers")
    roomPlayers.innerHTML = `Players: ${room.players}/4`;

    roomDiv.appendChild(roomId)
    roomDiv.appendChild(roomPlayers)

    container.appendChild(roomDiv)
}

Http.open("GET", url);
Http.send();