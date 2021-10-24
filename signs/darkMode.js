let svg = document.getElementById("themeSvg");
let isDarkMode = false;

let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme)
    if(storedTheme === "dark") {
        isDarkMode = true;
        svg.src = "sun.svg";
    } else {
        svg.src = "moon.svg";
        isDarkMode = false;
    }
}

function toggle() {
    if(!isDarkMode) {
        svg.src = "sun.svg";
    } else {
        svg.src = "moon.svg";
    }

    if (!isDarkMode) { //Make it black :smirk:
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else { //Cum time
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }
    isDarkMode = !isDarkMode;
}