class Cell {
    constructor(x, y, rType) {
        this.x = x;
        this.y = y;

        switch (rType) {
            case type.empty:
                return new Empty(x, y)
            case type.sand:
                return new Sand(x, y)
            case type.water:
                return new Water(x, y)
            case type.barrier:
                return new Barrier(x, y)
            case type.wood:
                return new Wood(x, y)
            case type.fire:
                return new Fire(x, y, 10, false)
            case type.oil:
                return new Oil(x, y)
            case type.bomb:
                return new Bomb(x, y)
        }
    }

    Update() {

    }
}