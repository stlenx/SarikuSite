class SemiSolid extends Block {
    constructor(x, y, s, size) {
        super(x, y, s, size);

        this.type = 1;
    }

    LoadSprite(path = "") {
        let image = new Image();
        switch (this.posType) {
            case 0: //Isolated block
                image.src = `${path}sprites/semisolid.png`;
                break;
            case 1: //Block at the left
                image.src = `${path}sprites/semisolidL.png`;
                break;
            case 2: //Block at the right
                image.src = `${path}sprites/semisolidR.png`;
                break;
            case 3: //Block at the left and right
                image.src = `${path}sprites/semisolidLR.png`;
                break;
        }

        this.sprite = image;
    }
}