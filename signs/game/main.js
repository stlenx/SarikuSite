let BenAPI = new XMLHttpRequest();
const BenURL= 'https://api.benaclegames.com/sl/asl';

let RandomAPI = new XMLHttpRequest();
const RandomURL = 'https://fight.sariku.gay/Game';

let LeaderboardAPI = new XMLHttpRequest();
const LeaderboardURL = "https://fight.sariku.gay/Leaderboard";

let loadedUrl = "";
let country = localStorage.getItem('country');
if(country === null) {
    fetch('https://api.ipregistry.co/?key=tryout')
        .then(function (response) {
            return response.json();
        })
        .then(function (payload) {
            country = payload.location.country.code.toLowerCase()
            localStorage.setItem('country', country);
            document.getElementById("user-country").src = `flags/4x3/${country}.svg`;
        });
} else {
    document.getElementById("user-country").src = `flags/4x3/${country}.svg`;
}

let username = localStorage.getItem('username');
if(username !== null) {
    let uploader = document.getElementsByClassName("upload-score")[0];
    uploader.remove();

    document.getElementById("username-display").innerText = `Username: ${username}`;
} else {
    document.getElementById("username-display").innerText = `Username not set yet, go play!`;
}

let answers = [];
let displayAnswers = [];
let textInput = document.getElementById("textInput");

String.prototype.normalize = function() {
    return this.replace(/[^a-zA-Z0-9]/g, '');
}

BenAPI.onreadystatechange = () => {
    if (BenAPI.readyState !== 4 || BenAPI.status !== 200) {
        if(BenAPI.status === 404) {
            bannerTXT.style.color = "red";
        }
        return;
    } // Check for ready because xmlhttprequest gae

    let output = JSON.parse(BenAPI.responseText);
    //console.log(output);

    displayAnswers = output.pageResults.pageDetails.synonyms;

    answers = [];
    output.pageResults.pageDetails.synonyms.forEach((synonym) => {
        answers.push(synonym.normalize());
    })

    getVideo(output);
}

RandomAPI.onreadystatechange = () => {
    if (RandomAPI.readyState !== 4 || RandomAPI.status !== 200) {
        return;
    } // Check for ready because xmlhttprequest gae

    getSign(RandomAPI.responseText);
}


function getVideo(output) {
    document.getElementById('source').setAttribute("src", output.pageResults.videoURL.split(":")[2]);
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

    textInput.value = "";
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
    HideHeart(guessesLeft);
    UpdateSize();
    ShowAnswers();
    if(username !== null) {
        PublishScore();
    }
    death.style.display = "unset";
}

function UpdateSize() {
    document.getElementById("death-message").style.height = `${document.documentElement.scrollHeight}px`;
}

function ShowAnswers() {
    let display = document.getElementsByClassName("answers")[0];

    while (display.children.length !== 0) display.removeChild(display.lastChild);

    displayAnswers.forEach((answer => {
        let h3 = document.createElement("h3");

        h3.innerText = answer;

        display.appendChild(h3);
    }))

    document.getElementById("result-score").innerText = `Your score was: ${score}`;
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

    ShowAnswersSkip();
    GetWord();

    HideHeart(guessesLeft);
}

function HideHeart(index) {
    let heart = document.getElementById(`heart-${index}`);

    heart.src = "heart-outline.svg";

    document.getElementById("hearts").style.backgroundColor = "rgb(255,35,35)";

    setTimeout(() => {
            document.getElementById("hearts").style.backgroundColor = "rgba(113,255,35, 0)";
        },
        100
    )
}

function ShowHeart(index) {
    let heart = document.getElementById(`heart-${index}`);

    heart.src = "heart.svg";
}

function HitGuess() {
    ShowAnswersSkip();
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("score").style.backgroundColor = "rgb(113,255,35)";

    setTimeout(() => {
            document.getElementById("score").style.backgroundColor = "rgba(113,255,35, 0)";
        },
        100
    )

    textInput.value = "";
    GetWord();
}

let guessesLeft = 3;
let score = 0;
let streak = 0;
let bonus = 25;
function TakeGuess() {
    let guess = textInput.value.replace(" ", "");

    if(answers.includes(guess.toUpperCase().normalize())) {
        //Guessed correctly
        score += 100 + (bonus * streak);

        streak++;
        HitGuess();
    } else {
        //Guessed incorrectly you poo head empty

        streak = 0;
        guessesLeft--;

        if(guessesLeft === 0) {
            Die();
            return;
        }

        MissGuess();
    }
}

function ShowAnswersSkip() {
    let skipContainer = document.getElementById("skip-message");
    skipContainer.style.opacity = "1";
    skipContainer.style.display = "unset";

    let display = document.getElementById("answers");

    while (display.children.length !== 0) display.removeChild(display.lastChild);

    displayAnswers.forEach((answer => {
        let h3 = document.createElement("h3");

        h3.innerText = answer;

        display.appendChild(h3);
    }));

    setTimeout(
        () => {
            skipContainer.style.opacity = "0";
            setTimeout(() => {
                    while (display.children.length !== 0) display.removeChild(display.lastChild);
                    skipContainer.style.display = "none";
                },
                200
            )
        },
        2000
    );
}

function Skip() {
    guessesLeft--;
    streak = 0;
    textInput.value = "";
    HideHeart(guessesLeft);

    if(guessesLeft === 0) {
        Die();
        return;
    } else {
        ShowAnswersSkip();
    }

    GetWord();
}

GetWord();

textInput.addEventListener("keydown", (e) => {
    if(e.code === "Enter") {
        TakeGuess();
    }
})
if(username === null) {
    document.getElementById("username").addEventListener("keydown", (e) => {
        if(e.code === "Enter") {
            PublishScore();
        }
    })
}

function PublishScore() {
    let name;
    if(username === null) {
        let input = document.getElementById("username");
        name = input.value;
        document.getElementById("username-display").innerText = `Username: ${name}`;
        localStorage.setItem("username", name);
    } else {
        name = username;
    }

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

    UploadScore(name, score, country);
}

function UploadScore(name, score, region) {
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

function EditUsername() {
    document.getElementById("username-display").innerText = "Username: ";

    document.getElementById("new-username").value = username;
    document.getElementById("new-username").style.display = "unset";
}

document.getElementById("new-username").addEventListener("keydown", (e) => {
    if(e.code === "Enter") {
        username = document.getElementById("new-username").value;
        document.getElementById("username-display").innerText = `Username: ${username}`;
        document.getElementById("new-username").style.display = "none";
    }
})


// AUTOCORRECT STUFF
let output = document.getElementById("autoCorrect");

function CorrectText(text) {
    while (output.hasChildNodes()) { output.lastChild.remove(); }

    let results = autoCorrect(text);

    for(let i = 0; i < results.length; i++) {
        let button = document.createElement("button");
        button.innerText = results[i].name;
        button.onclick = function () {
            document.getElementById("textInput").value = this.innerText;
        }

        output.append(button);
    }
}

function autoCorrect(word) {
    class Word {
        constructor(value, name) {
            this.value = value;
            this.name = name;
        }
    }

    let best = [];

    for (let i = 0; i < words.length; i++) {
        let similarity = getSimilarity(words[i], word);

        if(best.length === 0) {
            best.push(new Word(similarity, words[i].toLowerCase()));
        }

        for(let x = 0; x < best.length; x++) {
            if(words[i] !== best[x].name) {
                if(similarity > best[x].value) {
                    best.splice(x, 0, new Word(similarity, words[i].toLowerCase()));
                    best = best.slice(0, 10);
                    break;
                }
            }
        }
    }

    if(best.length === 1) {
        best = [];
    }

    return best;
}

function getSimilarity(word1, word2) {
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    const bigram1 = getBigram(word1);
    const bigram2 = getBigram(word2);

    let similar = [];

    for (let i = 0; i < bigram1.length; i++) {
        if(bigram2.indexOf(bigram1[i]) > -1) {
            similar.push(bigram1[i]);
        }
    }

    return similar.length / Math.max(bigram1.length, bigram2.length);
}

function getBigram(word) {
    let result = [];

    for (let i = 0; i < word.length-1; i++) {
        result.push(word[i] + word[i+1]);
    }

    return result;
}