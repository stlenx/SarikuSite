let domain = "fight.sariku.gay";
const Http = new XMLHttpRequest();

Http.onreadystatechange = () => {
    if (Http.readyState !== 4 || Http.status !== 200) return; // Check for ready because xmlhttprequest gae

    let output = JSON.parse(Http.responseText)
    output.forEach(AddRoom)
    console.log(output)
}

const url=`https://${domain}/games`; //Change to http://fight.sariku.gay/games http://192.168.0.69:6969/games
Http.open("GET", url);
Http.send();

function AddRoom(room) {
    let container = document.getElementById("rooms");

    //Make container div
    let roomDiv = document.createElement("div");
    roomDiv.setAttribute("class", "room")
    roomDiv.setAttribute("id", room.id)


    //Make info/join button div ----------
    let joinButton = document.createElement("div")
    joinButton.setAttribute("class", "joinButton")
    joinButton.onclick = function () {
        location.href = `game/index.html?room=${room.id}`;
    }

    //Make roomId div
    let roomId = document.createElement("div");
    roomId.setAttribute("class", "roomId")
    roomId.innerHTML = room.id;

    let roomPlayers = document.createElement("div");
    roomPlayers.setAttribute("class", "roomPlayers")
    roomPlayers.innerHTML = `Players: ${room.players}/4`;

    joinButton.appendChild(roomId)
    joinButton.appendChild(roomPlayers)
    //End of that lol ------------


    //Make close button div -------------
    let closeIcon = document.createElement("div");
    closeIcon.setAttribute("class", "closeIcon")
    closeIcon.onclick = function () {
        RemoveRoom(room.id)
    }

    let line1 = document.createElement("div");
    line1.setAttribute("class", "line");
    let line2 = document.createElement("div");
    line2.setAttribute("class", "line2");

    closeIcon.appendChild(line1)
    closeIcon.appendChild(line2)
    //End of that lol  ---------

    roomDiv.appendChild(joinButton)
    roomDiv.appendChild(closeIcon)

    container.appendChild(roomDiv)
}

function RemoveRoom(id) {
    let toRemove = document.getElementById(id);
    toRemove.classList.add("disappear")

    setTimeout(function(){
        toRemove.remove()
        Http.open("GET", `https://fight.sariku.gay/games/${id}/delete`);
        Http.send();
    }, 500);
}

function MakeRoomButton() {
    location.href = `new/index.html`;
}