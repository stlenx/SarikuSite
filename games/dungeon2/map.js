class Map {
    constructor(dimensions, maxTunnels, maxLength) {
        this.dimensions = dimensions;
        this.maxTunnels = maxTunnels;
        this.maxLength = maxLength;
        this.wallWidth = 200;
    }

    GenerateMap() {
        let maxTunnels = this.maxTunnels;

        let map = this.createArray(1, this.dimensions);

        let x = Math.floor(getRandom(1, this.dimensions - 1));
        let y = Math.floor(getRandom(1, this.dimensions - 1));

        this.starting = new Vector2(x, y);
        this.ending = new Vector2(x, y);

        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        let hasSetEnd = false;
        while(maxTunnels !== 0) {
            let length = Math.ceil(Math.random() * this.maxLength);
            let dir = directions[Math.floor(Math.random() * directions.length)];

            for(let i = 0; i < length; i++) {
                let nextX = x + dir[0];
                let nextY = y + dir[1];

                if(nextX <= 1 || nextX >= this.dimensions - 1 || nextY <= 1 || nextY >= this.dimensions - 1) {
                    i = length;
                } else {
                    map[x][y] = 0;
                    map[nextX][nextY] = 0;
                    x = nextX;
                    y = nextY;
                }
            }

            if(!hasSetEnd && getRandom(1,2) > 1.5) {
                this.ending.x = x;
                this.ending.y = y;
                hasSetEnd = true;
            }

            maxTunnels--;
        }

        this.map = map;
    }

    createArray(num, dimensions) {
        let array = [];
        for (let i = 0; i < dimensions; i++) {
            array.push([]);
            for (let j = 0; j < dimensions; j++) {
                array[i].push(num);
            }
        }
        return array;
    }
}