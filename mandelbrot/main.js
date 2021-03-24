let img
let inp

function setup () {
    createCanvas(1000, 1000);
    img = createImage(1000, 1000);
    img.loadPixels();

    inp = createInput(30);
    inp.position(90,19);

    button = createButton('Draw set');
    button.position(19, 19);
    button.mousePressed(render);

    textSize(18);
    text('← Number of iterations (takes a while, be patient)',270, 28);
    fill(0, 102, 153);
}

const gpu = new GPU();
const calculate = gpu.createKernel(function (itr) {
    let xPercent = this.thread.x / 1000;
    let yPercent = this.thread.y / 1000;

    let newX = -2 + (2 + 2) * xPercent;
    let newY = -2 + (2 + 2) * yPercent;

    let Zreal = 0;
    let Zimg = 0;
    let Creal = newX;
    let Cimg = newY;

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

function render() {

    let output = calculate(inp.value())
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
    img.updatePixels();
    image(img, 0, 0);
}

function writeColor(image, x, y, red, green, blue, alpha) {
    let index = (x + y * width) * 4;
    image.pixels[index] = red;
    image.pixels[index + 1] = green;
    image.pixels[index + 2] = blue;
    image.pixels[index + 3] = alpha;
}