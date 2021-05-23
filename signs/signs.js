const Http = new XMLHttpRequest();
const url='https://5t77ip5on5.execute-api.eu-west-2.amazonaws.com/prod/asl';
let loadedSign = ""

Http.onreadystatechange = () => {
    if (Http.readyState !== 4 || Http.status !== 200) return; // Check for ready because xmlhttprequest gae

    let output = JSON.parse(Http.responseText)
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
    document.getElementById('source').setAttribute("src", output.pageResults.videoURL)
    document.getElementById('video').load()

    //Variations time
    let container = document.getElementById("variations");

    while (container.hasChildNodes()) container.removeChild(container.lastChild)

    let pos = 0;
    Array.prototype.forEach.call(output.pageResults.variations, function(i){
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

        pos++;
    });
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
    let container = document.getElementById("container");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild)
    }
    getSign(input)

}

function getSign(sign) {
    loadedSign = sign;
    Http.open("GET", url);
    Http.setRequestHeader("sign", sign)
    Http.send();
}

function CheckUrl() {
    let url = new URL(document.location.href);
    url.searchParams.sort();

    let sign = url.searchParams.get("sign");
    let id = url.searchParams.get("id");
    let v = url.searchParams.get("v");

    let searchSign = sign;

    if(id !== null) {
        searchSign = `https://www.signingsavvy.com/sign/${sign.toUpperCase()}/${id}/${v}`
    }

    document.getElementById("textInput").value = sign;
    console.log(searchSign)
    getSign(searchSign);
}

CheckUrl()