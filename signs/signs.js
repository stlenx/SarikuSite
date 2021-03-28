const Http = new XMLHttpRequest();
const url='https://5t77ip5on5.execute-api.eu-west-2.amazonaws.com/prod/asl';



Http.onreadystatechange = (e) => {
    let output = JSON.parse(Http.responseText)
    console.log(output.pageResults.videoURL)

    let video = document.getElementById('video');
    let source = document.getElementById('source');

    source.setAttribute("src", output.pageResults.videoURL)

    video.load();

    video.loop = true;
}

const input = document.querySelector('input');
const log = document.getElementById('log');

input.addEventListener('change', updateValue);

function updateValue(e) {
    log.textContent = e.target.value;
}

function getSign(sign) {
    Http.open("GET", url);
    Http.setRequestHeader("sign", sign)
    Http.send();
}