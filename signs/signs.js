const Http = new XMLHttpRequest();
const url='https://5t77ip5on5.execute-api.eu-west-2.amazonaws.com/prod/asl';



Http.onreadystatechange = () => {
    if (Http.readyState !== 4 || Http.status !== 200) return; // Check for ready because xmlhttprequest gae

    let output = JSON.parse(Http.responseText)

    console.log(output)
    if (output.pageResults === null) {
        document.getElementById('statusTEXT').innerHTML = "Status: FAIL";
    } else {

        if (output.pageResults !== undefined) {
            document.getElementById('statusTEXT').innerHTML = "Status: OK";

            let video = document.getElementById('video');
            let source = document.getElementById('source');

            source.setAttribute("src", output.pageResults.videoURL)

            video.load();

            video.loop = true;

            //let container = document.getElementById("container");
            //let input = document.createElement("input");
            //input.id = "test";
            //input.name = "interpretations";
            //input.value = "testing";
            //input.type = "radio";
            //container.appendChild(input);
            //container.appendChild(document.createElement("br"));

        } else {
            document.getElementById('statusTEXT').innerHTML = "Status: OK (cannot display video atm)";
        }
    }
}

function getSign(sign) {
    Http.open("GET", url);
    Http.setRequestHeader("sign", sign)
    Http.send();
}