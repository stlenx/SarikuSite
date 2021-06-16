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

    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "room")
    newDiv.innerHTML = room.id;
    newDiv.onclick = function () {
        location.href = `game/index.html?room=${room.id}`;
    }

    container.appendChild(newDiv)
}

Http.open("GET", url);
Http.send();