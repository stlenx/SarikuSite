let uselessWords = ["are"];
let words = [];
let loadedWords = {};
let currentWord = 69;

let API = new XMLHttpRequest();
let mainC = document.getElementById("mainContainerGenerator");
let isOn = false;
let progress = document.getElementById("progressBar");
let progressC = document.getElementById("progressC");
let v = document.getElementById("videoGenerator");
let s = document.getElementById("sourceGenerator");

API.onreadystatechange = () => {
    if (API.readyState !== 4 || API.status !== 200) {
        if(API.status === 404) {

        }
        return;
    } // Check for ready because xmlhttprequest gae

    let output = JSON.parse(API.responseText)
    console.log(output)

    if(Object.keys(loadedWords).length >= words.length) {
        return;
    }

    let result = "";
    if (output.pageResults !== undefined) {
        result = getLeVideo(output)
    } else {
        getLeInterpretations(output);
        return;
    }

    loadedWords[words[Object.keys(loadedWords).length]] = result;

    ShowProgressBar(words.length);
    UpdateProgressBar(Object.keys(loadedWords).length);

    if(Object.keys(loadedWords).length < words.length) {
        getWord(words[Object.keys(loadedWords).length]);
        return;
    }

    currentWord = 0;
    HideProgressBar();
    ShowWords();
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
    let word = words[currentWord];
    let url = loadedWords[word];

    s.setAttribute("src", url);
    v.load()
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

    getWord(words[0]);
}

function getWord(sign) {
    if(sign === "") return;
    API.open("GET", url);
    API.setRequestHeader("sign", sign)
    API.send();
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
