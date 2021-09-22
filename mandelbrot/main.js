const canvas = document.getElementById('canvas');

const size = canvas.height;

let whichSet = 0;
let veryJulia = false;

const gpu = new GPU();
const calculateMandelbrot = gpu.createKernel(function (itr, zoom, x, y) {

    let Creal = this.thread.x / zoom -(x / zoom);
    let Cimg = this.thread.y / zoom -(y / zoom);

    let Zreal = 0;
    let Zimg = 0;

    let n = 0;
    while (Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2 && n < itr)
    {
        let cringe1 = Zreal * Zreal -Zimg * Zimg;
        let cringe2 = Zreal * Zimg * 2;
        Zreal = cringe1 + Creal;
        Zimg = cringe2+ Cimg;
        n++;
    }

    if(Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2)
        return -1;
    return n;
}).setOutput([size,size]);

const calculateShip = gpu.createKernel(function (itr) {
    let Creal = this.thread.x / 300 -1.95;
    let Cimg = this.thread.y / 300 -1.8;

    let Zreal = 0;
    let Zimg = 0;

    let n = 0;
    while (Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2 && n < itr)
    {
        let cringe1 = Zreal * Zreal - Zimg * Zimg;
        let cringe2 = Math.abs(Zreal * Zimg * 2);
        Zreal = cringe1 + Creal;
        Zimg = cringe2+ Cimg;
        n++;
    }

    if(Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2)
        return -1;
    return n;
}).setOutput([size,size]);


const calculateJulia = gpu.createKernel(function (itr, x, y) {

    let Zreal = this.thread.x / 300 -1.95;
    let Zimg = this.thread.y / 300 -1.8;

    let Creal = x / 300 -1.95;
    let Cimg = y / 300 -1.8;

    let n = 0;
    while (Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2 && n < itr)
    {
        let cringe1 = Zreal * Zreal -Zimg * Zimg;
        let cringe2 = Zreal * Zimg * 2;
        Zreal = cringe1 + Creal;
        Zimg = cringe2+ Cimg;
        n++;
    }
    if(Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2)
        return -1;
    return n;
}).setOutput([size,size]);

const calculateJuliaShip = gpu.createKernel(function (itr, x, y) {

    let Zreal = this.thread.x / 300 -1.95;
    let Zimg = this.thread.y / 300 -1.8;

    let Creal = x / 300 -1.95;
    let Cimg = y / 300 -1.8;

    let n = 0;
    while (Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2 && n < itr)
    {
        let cringe1 = Zreal * Zreal - Zimg * Zimg;
        let cringe2 = Math.abs(Zreal * Zimg * 2);
        Zreal = cringe1 + Creal;
        Zimg = cringe2+ Cimg;
        n++;
    }
    if(Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2)
        return -1;
    return n;
}).setOutput([size,size]);

/*
function mouseClicked() {
    if(!(mouseX > 8 && mouseX < 260 && mouseY > 10 && mouseY < 34))
    {
        let xPercent = mouseX / 1000;
        let yPercent = mouseY / 1000;

        let X = -2 + (2 + 2) * xPercent;
        let Y = -2 + (2 + 2) * yPercent;
        
        let output = calculateJulia(inp.value(), X, Y)

        for(let x = 0; x < 1000; x++) {
            for(let y = 0; y < 1000; y++) {
                if (output[y][x] === -1)
                {
                    writeColor(img, x, y, 0, 0, 0, 255);
                }
                else
                {
                    var hueValue = (int) ((100 * output[y][x]) / 30);
                    colorMode(HSB, 255);
                    let c = color(hueValue, 255, 255);

                    writeColor(img, x, y, red(c), green(c), blue(c), 255);
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
        //img.updatePixels();
        //image(img, 0, 0);
    }
}
 */

const ctx = canvas.getContext('2d');

const imageData = ctx.createImageData(size, size);
const data = imageData.data;

let iterations = parseInt(document.getElementById('iterations').value);

function MandelbrotSet() {
    iterations = parseInt(document.getElementById('iterations').value);
    let output = calculateMandelbrot(iterations, 400,800, 500)

    DrawImage(output)
    whichSet = 1;
}

function BurningShip() {
    iterations = parseInt(document.getElementById('iterations').value);
    let output = calculateShip(iterations)

    DrawImage(output,iterations)
    whichSet = 2;
}

let animationRunning = false;
function Animate() {
    if(!animationRunning) {
        window.requestAnimationFrame(renderAnimation);
        document.getElementById('animation').innerHTML = "Stop";
        animationRunning = true;
    } else {
        document.getElementById('animation').innerHTML = "Animate";
        animationRunning = false;
    }
}

let i = 600;
function renderAnimation() {

    iterations = parseInt(document.getElementById('iterations').value);
    let output = calculateMandelbrot(iterations, i,600 + i * 1.406548, 500)
    DrawImage(output,iterations)

    if(i < 200000000 && animationRunning) {
        i*=1.03
        window.requestAnimationFrame(renderAnimation);
    } else {
        document.getElementById('animation').innerHTML = "Animate";
        animationRunning = false;
        i = 600;
    }
}

function alwaysJulia() {
    if(veryJulia) {
        document.getElementById('julia').innerHTML = "Enable always Julia";
        veryJulia = false;
    } else {
        document.getElementById('julia').innerHTML = "Disable always Julia";
        veryJulia = true;
    }
}

canvas.addEventListener("mousemove", function (e) {
    if(veryJulia) {
        switch (whichSet) {
            case 1:
            {
                let output = calculateJulia(iterations, e.offsetX, e.offsetY);
                DrawImage(output)
                break;
            }
            case 2:
            {
                let output = calculateJuliaShip(iterations, e.offsetX, e.offsetY);
                DrawImage(output)
                break;
            }
            default:
                break;
        }
    }
});

canvas.addEventListener("click", function (e) {
    switch (whichSet) {
        case 1:
        {
            let output = calculateJulia(iterations, e.offsetX, e.offsetY);
            DrawImage(output)
            break;
        }
        case 2:
        {
            let output = calculateJuliaShip(iterations, e.offsetX, e.offsetY);
            DrawImage(output)
            break;
        }
        default:
            break;
    }
});

/*
for (let i = 600; i < 200000000; i*=1.01)
    {
        sleep(16).then(() => {
            iterations = parseInt(document.getElementById('iterations').value);
            let output = calculateMandelbrot(iterations, i,600 + i * 1.406548, 500)
            DrawImage(output,iterations)
        });
    }

 */
let test = `dasdas${size}`

function DrawImage(values) {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let n = values[x][y];
            let index = (y + x * size) * 4;
            if (n === -1)
            {
                //writeColor( x, y, 0, 0, 0, 255);
                data[index] = 0;
                data[index+1] = 0;
                data[index+2] = 0;
            }
            else
            {
                let hueValue = remap(0,iterations, 0,1, n);
                let color = hslToRgb(hueValue, 0.8,0.5)
                //console.log(color, hueValue)
                data[index] = color[1];
                data[index+1] = color[2];
                data[index+2] = color[3];
            }
            data[index + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function remap(oneS, oneE, twoS, twoE, n) {
    return twoS + ((twoE - twoS) / (oneE - oneS)) * (n - oneS)
}

function hslToRgb(h, s, l){
    let r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

