let inp;

function setup () {
    createCanvas(windowHeight, windowHeight);
    inp = createInput(30);
    inp.position(90,19);

    button = createButton('Draw set');
    button.position(19, 19);
    button.mousePressed(DrawSet);

    textSize(18);
    text('← Number of iterations (takes a while, be patient)',270, 28);
    fill(0, 102, 153);
}

function DrawSet() {
    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            var point = coordFromPixelLocation(x,y,-2,2,-2,2);

            var result = GetPixelInSet(new complex(0,0), new complex(point.x,point.y));

            if (result === -1)
            {
                stroke('black');
                strokeWeight(1);
                rect(x, y, 1, 1);
            }
            else
            {
                var hueValue = (int) ((100 * result) / 30);

                noStroke();
                colorMode(HSB, 255);
                let c = color(hueValue, 255, 255);
                fill(c);
                rect(x, y, 1, 1);
            }
        }
    }
}

function GetPixelInSet(Z,C) {
    var n = 0;
    while (Z.modulus() <= 2 && n < inp.value())
    {
        Z = Z.multi(Z,Z);
        Z = Z.sum(Z, C);
        n++;
    }

    return Z.modulus() > 2 ? n : -1;
}

function coordFromPixelLocation(pixelX, pixelY, minCoordX, maxCoordX, minCoordY, maxCoordY) {
    let xPercent = pixelX / width;
    let yPercent = pixelY / height;

    let newX = minCoordX + (maxCoordX - minCoordX) * xPercent;
    let newY = minCoordY + (maxCoordY - minCoordY) * yPercent;

    return new point2d (newX, newY);
}