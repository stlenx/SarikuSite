const Http = new XMLHttpRequest();
const url='https://5t77ip5on5.execute-api.eu-west-2.amazonaws.com/prod/asl';



Http.onreadystatechange = () => {
    if (Http.readyState !== 4 || Http.status !== 200) return; // Check for ready because xmlhttprequest gae

    let output = JSON.parse(Http.responseText)

    console.log(output)

    if (output.pageResults !== undefined) {

        let video = document.getElementById('video');
        let source = document.getElementById('source');

        source.setAttribute("src", output.pageResults.videoURL)

        video.load();

        video.loop = true;


    } else {

        let container = document.getElementById("container");

        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }

        let pos = 0;
        Array.prototype.forEach.call(output.searchResults.results, function(i){

            //Make the radio button
            let input = document.createElement("input");
            input.id = i.context.slice(7, i.context.length -1);
            input.name = "interpretations";
            input.value = i.pageLink;
            input.onclick = function() { getSign(this.value); };
            input.type = "radio";

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
}

function inputChanged(input) {
    let container = document.getElementById("container");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild)
    }
    getSign(input)
}

function getSign(sign) {
    Http.open("GET", url);
    Http.setRequestHeader("sign", sign)
    Http.send();
}