let div = document.getElementById("error");

function displayErrorMessage(message, backgroundColor, color, duration = 2000) {
    div.innerText = message;

    div.style.backgroundColor = backgroundColor;
    div.style.color = color;

    div.classList.add("showError");

    setTimeout(function () {
        hideErrorMessage();
    }, duration);
}

function hideErrorMessage() {
    div.classList.remove("showError");
}