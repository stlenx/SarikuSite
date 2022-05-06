let BenAPI = new XMLHttpRequest();
const BenURL= 'https://api.benaclegames.com/sl/asl';

let RandomAPI = new XMLHttpRequest();
const RandomURL = 'https://fight.sariku.gay:5001/Game';

let LeaderboardAPI = new XMLHttpRequest();
const LeaderboardURL = "https://fight.sariku.gay:5001/Leaderboard";

let loadedUrl = "";

let answers = [];
let textInput = document.getElementById("textInput");

BenAPI.onreadystatechange = () => {
    if (BenAPI.readyState !== 4 || BenAPI.status !== 200) {
        if(BenAPI.status === 404) {
            text.style.color = "red";
        }
        return;
    } // Check for ready because xmlhttprequest gae

    let output = JSON.parse(BenAPI.responseText);
    console.log(output);

    answers = output.pageResults.pageDetails.synonyms;

    getVideo(output);
}

RandomAPI.onreadystatechange = () => {
    if (RandomAPI.readyState !== 4 || RandomAPI.status !== 200) {
        return;
    } // Check for ready because xmlhttprequest gae

    getSign(RandomAPI.responseText);
}


function getVideo(output) {
    document.getElementById('source').setAttribute("src", output.pageResults.videoURL);
    document.getElementById('video').load();

    //Variations time
    let container = document.getElementById("variations");

    //Reset variations before adding the new ones
    while (container.hasChildNodes()) container.removeChild(container.lastChild)

    for(let pos = 0; pos < output.pageResults.variations.length-1; pos++) {
        let i = output.pageResults.variations[pos];
        //Make the radio button
        let input = makeRadioInput(i.type,"variations", i.url, function() { getSign(this.value); })

        //Check what sign variation we have selected and check it
        if(i.url.slice(i.url.length - 1) === loadedUrl.slice(loadedUrl.length - 1))
            input.checked = true;

        //Make the label for the button
        let tag = document.createElement("label")
        tag.setAttribute("for", i.type)
        tag.innerHTML = i.type;

        //Add the new elements
        container.appendChild(input)
        container.appendChild(tag)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function makeRadioInput(id, name, value, onclick) {
    let input = document.createElement("input")

    input.id = id;
    input.name = name;
    input.value = value;
    input.onclick = onclick;
    input.type = "radio";

    return input;
}

function getSign(sign) {
    if(sign === "") return;
    loadedUrl = sign;
    BenAPI.open("GET", BenURL);
    BenAPI.setRequestHeader("sign", sign)
    BenAPI.send();
}

function GetWord() {
    RandomAPI.open("GET", RandomURL);
    RandomAPI.send();
}

function TryAgain() {
    let death = document.getElementById("death-message");
    death.style.display = "none";

    score = 0;
    document.getElementById("score").innerText = `Score: ${score}`;

    guessesLeft = 3;


    for(let i = 0; i < 3; i++) {
        ShowHeart(i);
    }

    GetWord();
}

function Die() {
    let death = document.getElementById("death-message");
    UpdateSize();
    ShowAnswers();
    death.style.display = "unset";
}

function UpdateSize() {
    document.getElementById("death-message").style.height = `${document.documentElement.scrollHeight}px`;
}

function ShowAnswers() {
    let displays = document.getElementsByClassName("answers");

    for(let i = 0; i < displays.length; i++) {
        let display = displays[i];

        answers.forEach((answer => {
            let h3 = document.createElement("h3");

            h3.innerText = answer;

            display.appendChild(h3);
        }))

        document.getElementById("result-score").innerText = `Your total score was: ${score}`;
    }
}

function MissGuess() {
    textInput.value = "";
    textInput.animate([
        // keyframes
        { transform: 'rotate(5deg)' },
        { transform: 'rotate(-5deg)' },
        { transform: 'rotate(5deg)' },
    ], {
        // timing options
        duration: 100,
        iterations: 2
    });

    HideHeart(guessesLeft);
}

function HideHeart(index) {
    let heart = document.getElementById(`heart-${index}`);

    heart.src = "heart-outline.svg";
    //heart.style.filter = "none";
}

function ShowHeart(index) {
    let heart = document.getElementById(`heart-${index}`);

    heart.src = "heart.svg";
    //heart.style.filter = "none";
}

function HitGuess() {
    document.getElementById("score").innerText = `Score: ${score}`;
    textInput.value = "";
    GetWord();
}

let guessesLeft = 3;
let score = 0;
function TakeGuess() {
    let guess = textInput.value;

    if(answers.includes(guess.toUpperCase().replace(" ", ""))) {
        score += 100 * guessesLeft;
        HitGuess();
    } else {
        guessesLeft--;
        MissGuess();

        if(guessesLeft === 0) {
            Die();
        }
    }
}

function Skip() {
    guessesLeft--;
    textInput.value = "";
    HideHeart(guessesLeft);

    if(guessesLeft === 0) {
        Die();
    }

    GetWord();
}

GetWord();

textInput.addEventListener("keydown", (e) => {
    if(e.code === "Enter") {
        TakeGuess();
    }
})
document.getElementById("username").addEventListener("keydown", (e) => {
    if(e.code === "Enter") {
        PublishScore();
    }
})

function PublishScore() {
    let input = document.getElementById("username");
    let name = input.value;

    if(name === "") {
        input.animate([
            // keyframes
            { transform: 'rotate(5deg)' },
            { transform: 'rotate(-5deg)' },
            { transform: 'rotate(5deg)' },
        ], {
            // timing options
            duration: 100,
            iterations: 2
        });
        return;
    }

    //GET COUNTRY HAHAHAHAHAHAHA *evil laugh*
    fetch('https://api.ipregistry.co/?key=tryout')
        .then(function (response) {
            return response.json();
        })
        .then(function (payload) {
            UploadScore(name, score, payload.location.country.code.toLowerCase());
   });
}

function UploadScore(name, score, region) {
    console.log(name, score, region);

    LeaderboardAPI.open("POST", LeaderboardURL);
    LeaderboardAPI.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    LeaderboardAPI.send(JSON.stringify({
        name,
        score,
        region
    }));

    TryAgain();
}

LeaderboardAPI.onreadystatechange = () => {
    if (LeaderboardAPI.readyState !== 4 || LeaderboardAPI.status !== 200) {
        return;
    } // Check for ready because xmlhttprequest gae

    let leaderboard = JSON.parse(LeaderboardAPI.responseText);
    let table = document.getElementById("leaderboard");

    for (let i = 0; i < leaderboard.length; i++) {
        let user = leaderboard[i];

        let tr = CreateTd(i+1, user.name, user.score, user.region);

        table.appendChild(tr);
    }
}

function CreateTd(rank, name, score, region) {
    let tr = document.createElement("tr");

    let tdRank = document.createElement("td");
    tdRank.innerText = rank;

    let tdName = document.createElement("td");
    tdName.innerText = name;

    let tdScore = document.createElement("td");
    tdScore.innerText = score;

    let tdRegion = document.createElement("td");
    let img = document.createElement("img");
    img.src = `flags/4x3/${region}.svg`;
    tdRegion.appendChild(img);

    tr.append(tdRank, tdName, tdScore, tdRegion);

    return tr;
}

function GetTopUsers(amount) {
    LeaderboardAPI.open("GET", `${LeaderboardURL}/${amount}`);
    LeaderboardAPI.send();
}

GetTopUsers(10);