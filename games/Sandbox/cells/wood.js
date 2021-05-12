class Wood {
    constructor(x, y, random = Infinity) {
        this.x = x;
        this.y = y;
        this.type = type.wood;
        this.flammable = true;
        this.burningChance = 0.5;

        let randomC = random === Infinity ? (x % 2) * getRandom(-10, 10) : random;
        this.random = randomC;

        this.r = color[type.wood][0] + randomC
        this.g = color[type.wood][1] + randomC
        this.b = color[type.wood][2] + randomC
    }

    Update() {

    }
}