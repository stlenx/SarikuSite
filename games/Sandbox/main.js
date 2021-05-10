let canvas = document.getElementById("canvas");
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");

let world = [];

//Initialize world
for(let x = 0; x < canvas.width; x++) {
    world[x] = new Array(canvas.height)
    for(let y = 0; y < canvas.height; y++) {
        world[x][y] = new Cell();
    }
}

console.log(world)

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