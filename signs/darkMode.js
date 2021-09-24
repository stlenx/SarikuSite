let svg = document.getElementById("themeSvg");
let isDarkMode = false;

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
    console.log("I have run")
    if (!isDarkMode) { //Make it black :smirk:
        svg.src = "sun.svg";
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else { //Cum time
        svg.src = "moon.svg";
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }  
    isDarkMode = !isDarkMode;  
}