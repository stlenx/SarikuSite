const Http = new XMLHttpRequest();

Http.onreadystatechange = function () {
    if (this.readyState !== 4) return;

    if (this.status === 200) {
        let data = JSON.parse(this.responseText);

        location.href = `../game/index.html?room=${data.id}`;
    }
};

function buttonPressed() {
    let iframe = document.getElementById("iframe");
    let input = iframe.contentWindow.document.getElementById("FENinput");

    if(iframe.contentWindow.ValidateFEN(input.value)) {
        //Make room

        Http.open("POST", "https://fight.sariku.gay/games", false);
        Http.setRequestHeader("Content-Type", "application/json")
        Http.send(JSON.stringify({
            "LevelRepresentation": input.value,
            "Id": "amogusXd"
        }));

    } else {
        //Display invalid FEN text
        let text = document.getElementById("invalidFEN");
        text.classList.add("visible")
        setTimeout(function(){
            text.classList.remove("visible");
        }, 1000);
    }
}