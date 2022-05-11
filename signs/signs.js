let BenAPI = new XMLHttpRequest();
const url= 'https://api.benaclegames.com/sl/asl';
let loadedSign = "";

let text = document.getElementById("textInput");

//Here we load html elements so we don't need to constantly load them over and over again
let noSignText = document.getElementById("NoInfo");
let mainContainer = document.getElementById("MainContainer");
let synonyms = document.getElementById("synonyms");
let context = document.getElementById("context");
let sentence = document.getElementById("sentence");

BenAPI.onreadystatechange = () => {
    if (BenAPI.readyState !== 4 || BenAPI.status !== 200) {
        if(BenAPI.status === 404) {
            text.style.color = "red";
        }
        return;
    } // Check for ready because xmlhttprequest gae

    let output = JSON.parse(BenAPI.responseText)
    console.log(output)

    let url = document.location.href.split("?");

    let nextURL = url[0] + `?sign=${loadedSign}`;

    let splits = loadedSign.split("/");
    if(splits.length > 1) {
        //4, 5 ,6
        nextURL = url[0] + `?sign=${splits[4].toLowerCase()}&id=${splits[5]}&v=${splits[6]}`;
    }

    const nextState = { additionalInformation: 'Cool thing i know right' };
    window.history.replaceState(nextState, "", nextURL);

    if (output.pageResults !== undefined) {
        getVideo(output)
        return
    }

    getInterpretations(output)
}

function getInterpretations(output) {
    let container = document.getElementById("container");

    while (container.hasChildNodes()) container.removeChild(container.lastChild)

    let pos = 0;
    Array.prototype.forEach.call(output.searchResults.results, function(i){

        //Make the radio button
        let input = makeRadioInput(
            i.context.slice(7, i.context.length -1),
            "interpretations",
            i.pageLink,
            function() { getSign(this.value); })

        //If it's the first button, mark it as checked and get the video
        if(pos === 0) {
            input.checked = true;
            getSign(input.value);
        }

        //Make the label for the button
        let tag = document.createElement("label")
        tag.setAttribute("for", i.context.slice(7, i.context.length -1))
        tag.innerHTML = i.context.slice(7, i.context.length -1);


        //Add the new elements
        container.appendChild(input)
        container.appendChild(tag)

        pos++;
    });
}

function getVideo(output) {
    //https://www.signingsavvy.com/media/mp4-hd/21/21609.mp4
    //Example video url

    document.getElementById('source').setAttribute("src", output.pageResults.videoURL)
    document.getElementById('video').load()

    //Variations time
    let container = document.getElementById("variations");

    //Reset variations before adding the new ones
    while (container.hasChildNodes()) container.removeChild(container.lastChild)

    for(let pos = 0; pos < output.pageResults.variations.length; pos++) {
        let i = output.pageResults.variations[pos];
        //Make the radio button
        let input = makeRadioInput(i.type,"variations", i.url, function() { getSign(this.value); })

        //Check what sign variation we have selected and check it
        if(i.url.slice(i.url.length - 1) === loadedSign.slice(loadedSign.length - 1))
            input.checked = true;

        //Make the label for the button
        let tag = document.createElement("label")
        tag.setAttribute("for", i.type)
        tag.innerHTML = i.type;

        //Add the new elements
        container.appendChild(input)
        container.appendChild(tag)
    }

    //Extra info! -Twiple-
    LoadExtraInfo(output.pageResults.pageDetails);
}

function LoadExtraInfo(pageDetails) {
    noSignText.classList.add("hidden");

    mainContainer.classList.remove("hidden");

    while (synonyms.hasChildNodes()) synonyms.removeChild(synonyms.lastChild)

    pageDetails.synonyms.forEach((synonym) => {
        let text = document.createElement("h3");
        text.innerHTML = capitalizeFirstLetter(synonym.toLowerCase());
        text.classList.add("synonym")
        synonyms.appendChild(text);
    })

    while (context.hasChildNodes()) context.removeChild(context.lastChild)

    {
        let text = document.createElement("h3");
        let innerHTML = pageDetails.context ? pageDetails.context : pageDetails.meaning;
        text.innerHTML = capitalizeFirstLetter(innerHTML.toLowerCase());
        text.classList.add("synonym")
        context.appendChild(text);
    }


    while (sentence.hasChildNodes()) sentence.removeChild(sentence.lastChild)

    {
        let text = document.createElement("h3");
        let innerHTML = pageDetails.sentence ? pageDetails.sentence : "No example given";
        text.innerHTML = capitalizeFirstLetter(innerHTML.toLowerCase());
        text.classList.add("synonym")
        sentence.appendChild(text);
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

function inputChanged(input) {
    text.style.color = getComputedStyle(document.documentElement).getPropertyValue('--dark');
    let container = document.getElementById("container");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild)
    }
    getSign(input)

}

function getSign(sign) {
    if(sign === "") return;
    loadedSign = sign;
    BenAPI.open("GET", url);
    BenAPI.setRequestHeader("sign", sign)
    BenAPI.send();
}

function CheckUrl() {
    let url = new URL(document.location.href);
    url.searchParams.sort();

    let sign = url.searchParams.get("sign");
    let id = url.searchParams.get("id");
    let v = url.searchParams.get("v");

    let searchSign = sign;

    if(id !== null) {
        searchSign = `https://www.signingsavvy.com/sign/${sign.toUpperCase()}/${id}/${v}`;
        console.log("apple")
    }

    if(searchSign === null) {
        //Sign of da day baby
        GetSignOfTheDay();
        return;
    }

    document.getElementById("textInput").value = sign;
    getSign(searchSign);
}

function GetSignOfTheDay() {
    let API = new XMLHttpRequest();
    API.onreadystatechange = () => {
        SignOfTheDayReturn(API);
    }

    API.open("GET", "https://www.signingsavvy.com/mapp3/signs?id=0&token=BOGUSTOKEN9873609&sotd=1"); //Thanks ben!
    API.send();
}

function SignOfTheDayReturn(API) {
    if (API.readyState !== 4 || API.status !== 200) {
        return;
    } // Check for ready because xmlhttprequest gae

    let output = JSON.parse(API.responseText);
    console.log(output);

    input = {
        "pageResults": {
            "videoURL": output.signid,
            "variations": [],
            "pageDetails": {
                "meaning": output.word,
                "context": output.asin,
                "synonyms": []
            }
        }
    }

    output.variations.forEach((v) => {
        let variation = {
            "type": `${v.signtype} ${v.variation}`,
            "url": `https://www.signingsavvy.com/sign/${v.word}/${v.wordid}/${v.variation}`
        }

        if(v.variation === 1) {
            variation.url = `https://www.signingsavvy.com//search/${v.word.toLowerCase()}`
        }

        if(v.signtype === "FS") {
            variation.type = "finger spell";
        }

        input.pageResults.variations.push(variation);
    })

    input.pageResults.pageDetails.synonyms.push(output.word);
    output.synonyms.forEach((s) => {
        input.pageResults.pageDetails.synonyms.push(s.word);
    })


    let container = document.getElementById("container");

    while (container.hasChildNodes()) container.removeChild(container.lastChild)

    let h1 = document.createElement("h1");
    h1.innerText = "Sign of the day";
    container.appendChild(h1);


    document.getElementById("textInput").value = output.word.toLowerCase();
    loadedSign = output.word.toLowerCase();
    getVideo(input);
}

CheckUrl();