class Solid extends Block {
    constructor(x, y, s, size) {
        super(x, y, s, size);

        this.type = 0;
    }

    LoadSprite(path = "") {
        let image = new Image();
        switch (this.posType) {
            case 0: //Isolated block
                image.src = `${path}sprites/solid.png`;
                break;
            case 1: //Block at the left
                image.src = `${path}sprites/solidL.png`;
                break;
            case 2: //Block at the right
                image.src = `${path}sprites/solidR.png`;
                break;
            case 3: //Block at the left and right
                image.src = `${path}sprites/solidLR.png`;
                break;
            case 4: //Block on top
                image.src = `${path}sprites/solid.png`;
                break;
            case 5: //Block on top and at the left
                image.src = `${path}sprites/solidL.png`;
                break;
            case 6: //Block on top and at the right
                image.src = `${path}sprites/solidR.png`;
                break;
            case 7: //Block on top, left and right
                image.src = `${path}sprites/solidLRT.png`;
                break;
            case 8: //Block on bottom
                image.src = `${path}sprites/solidLR.png`;
                break;
            case 9: //Block on bottom and left
                image.src = `${path}sprites/solidLR.png`;
                break;
            case 10: //Block on bottom and right
                image.src = `${path}sprites/solidLR.png`;
                break;
            case 11: //Block on bottom, left and right
                image.src = `${path}sprites/solidLR.png`;
                break;
            case 12: //Block on bottom and top
                image.src = `${path}sprites/solidLRT.png`;
                break;
            case 13: //Block on bottom, top and left
                image.src = `${path}sprites/solidLRT.png`;
                break;
            case 14: //Block on bottom, top and right
                image.src = `${path}sprites/solidLRT.png`;
                break;
            case 15: //Block on bottom, top, left and right
                image.src = `${path}sprites/solidLRT.png`;
                break;
        }

        this.sprite = image;
    }
}