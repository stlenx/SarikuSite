class Pixel {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.r = 0;
        this.g = 0;
        this.b = 0;

        this.alfa = 0;
        this.beta = 0;

        this.food = false;
    }

    MakeFood() {
        this.food = true;

        this.r = 0;
        this.g = 255;
        this.b = 0;
    }
}