let domain = "fight.sariku.gay";

let saveData = JSON.parse(localStorage.getItem('useLocalIp'));
if (saveData !== null) domain = "192.168.0.69:6969";

const Http = new XMLHttpRequest();
const url=`http://${domain}/games`; //Change to http://fight.sariku.gay/games http://192.168.0.69:6969/games

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

function UseLocal() {
    localStorage.setItem('useLocalIp', true);
}

function UseOnline() {
    localStorage.clear();
}