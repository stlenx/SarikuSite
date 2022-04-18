class Empty extends Cell {
    constructor(x,y) {
        super(x,y)
        this.type = type.empty;
        this.flammable = true;
        this.burningChance = 0.05;

        this.r = color[type.empty][0]
        this.g = color[type.empty][1]
        this.b = color[type.empty][2]
    }
}