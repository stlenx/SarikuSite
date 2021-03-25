
const gpu = new GPU();
const calculateSet = gpu.createKernel(function (itr) {
    let Creal = this.thread.x / 400 -2;
    let Cimg = this.thread.y / 400 -1.25;

    let Zreal = 0;
    let Zimg = 0;

    let n = 0;
    while (Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2 && n < itr)
    {
        let cringe1 = (Zreal * Zreal) + ((Zimg * Zimg) * -1);
        let cringe2 = (Zreal * Zimg) + (Zimg * Zreal);

        Zreal = cringe1;
        Zimg = cringe2;

        Zreal = Zreal + Creal;
        Zimg = Zimg + Cimg;
        n++;
    }

    if(Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2)
        return -1;
    return n;
}).setOutput([1000,1000]);

/*
const calculateJulia = gpu.createKernel(function (itr, Creal, Cimg) {
    let xPercent = this.thread.x / 1000;
    let yPercent = this.thread.y / 1000;

    let Zreal = -2 + (2 + 2) * xPercent;
    let Zimg = -2 + (2 + 2) * yPercent;

    let n = 0;
    while (Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) <= 2 && n < itr)
    {
        let cringe1 = (Zreal * Zreal) + ((Zimg * Zimg) * -1);
        let cringe2 = (Zreal * Zimg) + (Zimg * Zreal);

        Zreal = cringe1;
        Zimg = cringe2;

        Zreal = Zreal + Creal;
        Zimg = Zimg + Cimg;
        n++;
    }
    return Math.sqrt((Zreal * Zreal)+(Zimg * Zimg)) > 2 ? n : -1;
}).setOutput([1000,1000]);
*/

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

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const imageData = ctx.createImageData(1000, 1000);
const data = imageData.data;

function render() {
    let output = calculateSet(50)

    for(let x = 0; x < 1000; x++) {
        for(let y = 0; y < 1000; y++) {
            let n = output[x][y];
            let index = (y + x * 1000) * 4;
            if (n === -1)
            {
                //writeColor( x, y, 0, 0, 0, 255);
                data[index] = 0;
                data[index+1] = 0;
                data[index+2] = 0;
            }
            else
            {
                let hueValue = remap(0,50, 0,1, n);
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

window.onload = render;

function remap(oneS, oneE, twoS, twoE, n) {
    return twoS + ((twoE - twoS) / (oneE - oneS)) * (n - oneS)
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
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

