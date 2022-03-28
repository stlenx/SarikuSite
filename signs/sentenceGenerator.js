let uselessWords = ["are"];
let cachedWords = {};
let words = [];
let loadedWords = {};
let currentWord = 69;

let API = new XMLHttpRequest();
let mainC = document.getElementById("mainContainerGenerator");
let isOn = false;
let progress = document.getElementById("progressBar");
let progressC = document.getElementById("progressC");
let sentenceDisplay = document.getElementById("sentenceDisplay");
let v = document.getElementById("videoGenerator");
let s = document.getElementById("sourceGenerator");

API.onreadystatechange = () => {
    if (API.readyState !== 4 || API.status !== 200) {
        if(API.status === 404) {
            if(words[Object.keys(loadedWords).length] === undefined) return; //Idk

            ShowProgressBar(words.length);
            loadedWords[words[Object.keys(loadedWords).length]] = "DOESNOTEXIST";
            AddWordToDisplay(words[Object.keys(loadedWords).length - 1], Object.keys(loadedWords).length - 1, true);

            if(Object.keys(loadedWords).length < words.length) {
                getWord(words[Object.keys(loadedWords).length]);
                return;
            }

            currentWord = 0;
            HideProgressBar();
            ShowWords();
        }
        return;
    } // Check for ready because xmlhttprequest gae

    let output = JSON.parse(API.responseText);
    console.log(output);

    if(Object.keys(loadedWords).length >= words.length) {
        return;
    }

    let result = "";
    if (output.pageResults !== undefined) {
        result = getLeVideo(output); //Gets the url from the json
    } else {
        getLeInterpretations(output);
        return;
    }

    cachedWords[words[Object.keys(loadedWords).length]] = result;
    loadedWords[`${words[Object.keys(loadedWords).length]}-${Object.keys(loadedWords).length}`] = result;

    AddWord();
}

function AddWord() {
    ShowProgressBar(words.length);
    UpdateProgressBar(Object.keys(loadedWords).length);
    AddWordToDisplay(words[Object.keys(loadedWords).length - 1], Object.keys(loadedWords).length - 1);

    if(Object.keys(loadedWords).length < words.length) {
        getWord(words[Object.keys(loadedWords).length]);
        return;
    }

    currentWord = 0;
    HideProgressBar();
    ShowWords();
}

function AddWordToDisplay(word, id, nonExistant = false) {
    let span = document.createElement("span");
    span.innerText = word;
    span.id = id;
    if(nonExistant) {
        span.classList.add("notExist");
    }
    sentenceDisplay.appendChild(span);
}

function HideProgressBar() {
    progressC.style.display = "none";
}

function ShowProgressBar(max) {
    progress.setAttribute("max", max);
    progressC.style.display = "unset";
}

function UpdateProgressBar(value) {
    progress.value = value;
}

function getLeVideo(output) {
    //https://www.signingsavvy.com/media/mp4-hd/21/21609.mp4
    //Example video url

    return output.pageResults.videoURL;
}

function getLeInterpretations(output) {
    let result = output.searchResults.results[0];
    getWord(result.pageLink);
}

function ShowWords() {
    NeutralizeColors()

    //Change this
    let word = words[currentWord];
    let url = loadedWords[`${word}-${currentWord}`];

    if(url === "DOESNOTEXIST") {
        //Skip word
        if(Object.keys(loadedWords).length === 0) return;

        currentWord++;
        if(currentWord === words.length) {
            currentWord = 0;
        }

        ShowWords();

        return;
    }

    document.getElementById(currentWord).style.color = "rgb(55,255,0)";

    s.setAttribute("src", url);
    v.load()
}

function NeutralizeColors() {
    let Words = sentenceDisplay.children;
    for(let i = 0; i < Words.length; i++) {
        let word = Words[i];
        if(!word.classList.contains("notExist")) {
            word.style.color = getComputedStyle(document.documentElement).getPropertyValue('--dark');
        }
    }
}

function toggleGenerator() {
    UpdateSize()
    if(isOn) {
        console.log("hide");
        mainC.style.display = "none";
        isOn = false;
    } else {
        console.log("show");
        mainC.style.display = "unset";
        isOn = true;
    }
}

function ExecuteGenerator(text) {
    text = DeStupify(text);
    words = text.split(" ");
    loadedWords = {};

    while(sentenceDisplay.children.length > 0) sentenceDisplay.removeChild(sentenceDisplay.lastChild)
    getWord(words[0]);
}

function getWord(sign) {
    if(sign === "") return;
    if(sign in cachedWords) {
        loadedWords[`${words[Object.keys(loadedWords).length]}-${Object.keys(loadedWords).length}`] = cachedWords[sign];
        AddWord();
    } else {
        API.open("GET", url);
        API.setRequestHeader("sign", sign)
        API.send();
    }
}

function DeStupify(input) {
    let badChars = [",", ".", "?", "!"];
    for (let i = 0; i < badChars.length; i++) {
        input = input.replace(badChars[i], "");
    }

    return input;
}

v.addEventListener("ended", (ev => {
    if(Object.keys(loadedWords).length === 0) return;

    currentWord++;
    if(currentWord === words.length) {
        currentWord = 0;
    }

    ShowWords();
}))

function UpdateSize() {
    mainC.style.height = `${document.documentElement.scrollHeight}px`;
}

mainC.addEventListener("click", (ev => {
    if(ev.target === mainC) {
        toggleGenerator();
    }
}))
