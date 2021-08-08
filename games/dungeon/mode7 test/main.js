let image;
let imageData;

let img = new Image();
img.src = "../img/brick.png";

img.onload = function() {
    //Get the image data
    let c = document.createElement('canvas');
    c.setAttribute("width", img.width);
    c.setAttribute("height", img.height);
    let c4 = c.getContext('2d');
    c4.drawImage(img, 0, 0);
    image = c4.getImageData(0, 0, img.width, img.height);
};

let rCanvas = document.createElement("canvas");
let context = rCanvas.getContext("2d");

let WorldX = 1000;
let WorldY = 1000;
let WorldA = 0;

let Near = 0.01;
let Far = 0.1;
let FovHalf = Math.PI / 4;

function setup() {
    rCanvas.setAttribute("width", canvas.width * 0.3);
    rCanvas.setAttribute("height", canvas.height * 0.3);

    ctx.imageSmoothingEnabled = false;

    imageData = context.getImageData(0, 0, rCanvas.width, rCanvas.height);
}

function frame(dt) {
    if(image === undefined) return;

    if(input.KeyQ) Near += 0.01;
    if(input.KeyE) Near -= 0.01;

    if(input.KeyR) Far += 0.01;
    if(input.KeyT) Far -= 0.01;

    if(input.KeyY) FovHalf += 0.01;
    if(input.KeyU) FovHalf -= 0.01;

    let FarX1 = WorldX + Math.cos(WorldA - FovHalf) * Far;
    let FarY1 = WorldY + Math.sin(WorldA - FovHalf) * Far;

    let FarX2 = WorldX + Math.cos(WorldA + FovHalf) * Far;
    let FarY2 = WorldY + Math.sin(WorldA + FovHalf) * Far;

    let NearX1 = WorldX + Math.cos(WorldA - FovHalf) * Near;
    let NearY1 = WorldY + Math.sin(WorldA - FovHalf) * Near;

    let NearX2 = WorldX + Math.cos(WorldA + FovHalf) * Near;
    let NearY2 = WorldY + Math.sin(WorldA + FovHalf) * Near;

    let buf = new ArrayBuffer(imageData.data.length);
    let buf8 = new Uint8ClampedArray(buf);
    let data = new Uint32Array(buf);

    for (let y = 0; y < rCanvas.height / 2; y++) {
        let SampleDepth = y / rCanvas.height / 2;

        let StartX = (FarX1 - NearX1) / (SampleDepth) + NearX1;
        let StartY = (FarY1 - NearY1) / (SampleDepth) + NearY1;

        let EndX = (FarX2 - NearX2) / (SampleDepth) + NearX2;
        let EndY = (FarY2 - NearY2) / (SampleDepth) + NearY2;

        for(let x = 0; x < rCanvas.width; x++) {
            let SampleWidth = x / rCanvas.width;

            let SampleX = (EndX - StartX) * SampleWidth + StartX;
            let SampleY = (EndY - StartY) * SampleWidth + StartY;

            SampleX = SampleX % 1;
            SampleY = SampleY % 1;

            let index = (Math.floor(SampleY * img.height) + Math.floor(SampleX * img.width) * image.width) * 4;

            data[y * imageData.width + x] =
                (255   << 24) |	// alpha
                (image.data[index+2] << 16) |	// blue
                (image.data[index+1] <<  8) |	// green
                image.data[index];		// red;
        }
    }

    imageData.data.set(buf8);
    context.putImageData(imageData, 0, 0);

    ctx.drawImage(rCanvas, 0, canvas.height / 2, canvas.width, canvas.height);

    if(input.KeyA) {
        WorldA -= 0.04;
    }

    if(input.KeyD) {
        WorldA += 0.04;
    }

    if(input.KeyW) {
        WorldX += Math.cos(WorldA) * 0.02;
        WorldY += Math.sin(WorldA) * 0.02;
    }

    if(input.KeyS) {
        WorldX -= Math.cos(WorldA) * 0.02;
        WorldY -= Math.sin(WorldA) * 0.02;
    }
}