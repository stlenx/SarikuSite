class Word {
    constructor(name, url, fingerspelled = false) {
        this.name = name;
        this.url = url;
        this.fingerspelled = fingerspelled;
        this.fingerspell = [];
    }

    addLetter(link) {
        let id = loadedWords.length - 1;
        let span = document.getElementById(id);
        let p = document.createElement("p");
        p.innerText = this.name[this.fingerspell.length];
        span.appendChild(p);

        this.fingerspell.push(link);
    }
}

//Workie workie
let uselessWords = ["are"];
let cachedWords = {};
let words = [];
let loadedWords = [];
let currentWord = 69;

//APIs
let API = new XMLHttpRequest();
let LettersAPI = new XMLHttpRequest();

//Useful tags
let mainC = document.getElementById("mainContainerGenerator");
let isOn = false;
let progress = document.getElementById("progressBar");
let progressC = document.getElementById("progressC");
let sentenceDisplay = document.getElementById("sentenceDisplay");
let v = document.getElementById("videoGenerator");
let s = document.getElementById("sourceGenerator");

LettersAPI.onreadystatechange = () => {
    if (LettersAPI.readyState !== 4 || LettersAPI.status !== 200) {
        if(API.status === 404) {
            //Letter not found? WHOT

        }
        return;
    }

    if(!isJsonString(LettersAPI.responseText)) { //API Gae?
        console.log("JSON doo doo");
        return;
    }

    let output = JSON.parse(LettersAPI.responseText);
    console.log(output);

    //Do stuff
    let url = "default";
    let word = loadedWords[loadedWords.length - 1];
    let letter = word.name[word.fingerspell.length];

    if(output.pageResults !== undefined) {
        url = getLeVideo(output);
    } else {
        if(["i", "x"].includes(letter)) { //Special cases, "i" shows up as (like me you know) instead of the letter, x shows up as multiplication.
            getLetterInterpretation(output.searchResults.results[1].pageLink);
            return;
        }
        getLetterInterpretation(output.searchResults.results[0].pageLink);
        return;
    }

    cachedWords[letter] = url;
    loadedWords[loadedWords.length - 1].addLetter(url);

    GetLetter();
}

API.onreadystatechange = () => {
    if (API.readyState !== 4 || API.status !== 200) {
        if(API.status === 404) {
            //if(words[loadedWords.length] === undefined) return; //Idk

            //Must do fingerspelling D:
            GetFingerspelling();

            //loadedWords.push(new Word(words[loadedWords.length], "DOESNOTEXIST"));
            //
            //AddWord(true);
        }
        return;
    } // Check for ready because xmlhttprequest gae

    if(!isJsonString(API.responseText)) { //API Gae?
        console.log("JSON doo doo");
        return;
    }

    let output = JSON.parse(API.responseText);
    console.log(output);

    if(loadedWords.length >= words.length) {
        return;
    }

    let result = "";
    if (output.pageResults !== undefined) {
        result = getLeVideo(output); //Gets the url from the json
    } else {
        getLeInterpretations(output);
        return;
    }

    cachedWords[words[loadedWords.length]] = result;
    loadedWords.push(new Word(words[loadedWords.length], result));

    AddWord();
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function AddWord(fingerspelled = false) {
    ShowProgressBar(words.length);
    UpdateProgressBar(loadedWords.length);
    AddWordToDisplay(words[loadedWords.length - 1], loadedWords.length - 1, fingerspelled);

    if(fingerspelled) return;

    NextWord();
}

function NextWord() {
    if(loadedWords.length < words.length) {
        getWord(words[loadedWords.length]);
        return;
    }

    currentWord = 0;
    currentLetter = 0;
    HideProgressBar();
    ShowWords();
}

function AddWordToDisplay(word, id, fingerspelled = false) {
    let span = document.createElement("span");

    if(!fingerspelled) {
        span.innerText = word;
    }

    span.id = id;

    sentenceDisplay.appendChild(span);
}

let gettingFingerSpelling = false;
function GetFingerspelling() {
    if(gettingFingerSpelling) return;

    gettingFingerSpelling = true;
    loadedWords.push(new Word(words[loadedWords.length], null, true));
    AddWord(true);
    GetLetter();

    console.log("Getting Fingerspelling...");
}

function GetLetter() {
    let word = loadedWords[loadedWords.length - 1];
    let letter = word.name[word.fingerspell.length];

    if(letter === undefined) {
        console.log("Im done!!");
        gettingFingerSpelling = false;
        NextWord();
        return;
    }

    if(letter in cachedWords) {
        loadedWords[loadedWords.length - 1].addLetter(cachedWords[letter]);
        GetLetter();
    } else {
        LettersAPI.open("GET", BenURL);
        LettersAPI.setRequestHeader("sign", letter);
        LettersAPI.send();
    }
}

function getLetterInterpretation(letter) {
    console.log(letter, "pls");
    LettersAPI.open("GET", BenURL);
    LettersAPI.setRequestHeader("sign", letter)
    LettersAPI.send();
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

//MAIN LOOP
let showingFingerSpelling = false;
let currentLetter = 69;
function ShowWords() {
    NeutralizeColors();

    let word = loadedWords[currentWord];
    let url = word.url;

    showingFingerSpelling = word.fingerspelled;

    document.getElementById(currentWord).style.color = "rgb(55,255,0)";

    if(showingFingerSpelling) {
        url = word.fingerspell[currentLetter];

        ColorGrey(currentWord);
        document.getElementById(currentWord).children[currentLetter].style.color = "rgb(55,255,0)";
    }

    s.setAttribute("src", url);
    v.load()
}

v.addEventListener("ended", (e => {
    if(loadedWords.length === 0) return;

    //Different behaviour
    if(showingFingerSpelling) {
        currentLetter++;

        if(currentLetter === loadedWords[currentWord].fingerspell.length) {
            currentLetter = 0;
            showingFingerSpelling = false;
        } else {
            ShowWords();
            return;
        }
    }

    currentWord++;

    if(currentWord === words.length) {
        currentWord = 0;
    }

    ShowWords();
}))

function ColorGrey(id) {
    let ps = document.getElementById(id).children;

    for(let i = 0; i < ps.length; i++) {
        ps[i].style.color = "rgb(132,132,132)";
    }
}

function NeutralizeColors() {
    let Words = sentenceDisplay.children;
    for(let i = 0; i < Words.length; i++) {
        let word = Words[i];
        word.style.color = getComputedStyle(document.documentElement).getPropertyValue('--dark');

        if(word.childElementCount !== 0) {
            let letters = word.children;

            for(let i = 0; i < letters.length; i++) {
                letters[i].style.color = getComputedStyle(document.documentElement).getPropertyValue('--dark');
            }
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
    words = text.trim().split(" ");
    loadedWords = [];

    while(sentenceDisplay.children.length > 0) sentenceDisplay.removeChild(sentenceDisplay.lastChild)
    getWord(words[0]);
}

function getWord(sign) {
    if(sign === "") return;
    if(sign in cachedWords) {
        loadedWords.push(new Word(words[loadedWords.length], cachedWords[sign]));
        AddWord();
    } else {
        API.open("GET", BenURL);
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

function UpdateSize() {
    mainC.style.height = `${document.documentElement.scrollHeight}px`;
}

mainC.addEventListener("click", (ev => {
    if(ev.target === mainC) {
        toggleGenerator();
    }
}))
