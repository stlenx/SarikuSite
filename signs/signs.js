const Http = new XMLHttpRequest();
const url='https://5t77ip5on5.execute-api.eu-west-2.amazonaws.com/prod/asl';
let loadedSign = ""

Http.onreadystatechange = () => {
    if (Http.readyState !== 4 || Http.status !== 200) return; // Check for ready because xmlhttprequest gae

    let output = JSON.parse(Http.responseText)
    console.log(output)

    const nextURL = document.location.href + loadedSign;
    const nextTitle = 'Signs';
    const nextState = { additionalInformation: 'Cool thing i know right' };

    window.history.replaceState(nextState, nextTitle, nextURL);

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

    let val = url.searchParams.get("sign");
    document.getElementById("textInput").value = val;
    getSign(val);
}

CheckUrl()