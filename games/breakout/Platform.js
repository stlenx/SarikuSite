class Platform {
    constructor(width, height) {
        this.x = width / 2 - (width * 0.25) / 2;
        this.y = height - 50;
        this.w = width * 0.25;
        this.h = width * 0.25 * 0.0666;
        this.color = "#616161";
        this.started = false;
    }
}

