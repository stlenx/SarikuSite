class Map {
    constructor(dimensions, maxTunnels, maxLength) {
        this.dimensions = dimensions;
        this.maxTunnels = maxTunnels;
        this.maxLength = maxLength;
    }

    generateMap() {
        let maxTunnels = this.maxTunnels;

        let map = this.createArray(1, this.dimensions);

        let x = Math.floor(getRandom(1, this.dimensions - 1));
        let y = Math.floor(getRandom(1, this.dimensions - 1));

        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

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

            maxTunnels--;
        }

        this.map = map;
    }

    generateWalls() {
        this.walls = [];
        let wallWidth = 50;
        let halfWidth = wallWidth * 0.5;

        //Detect horizontal walls
        for(let y = 1; y < this.map.length; y++) {
            let lastWall = null;
            let secondaryWall = null;
            for(let x = 1; x < this.map.length; x++) {
                if(this.map[x][y] === 0) {
                    if(this.map[x][y-1] !== 0) {
                        if(lastWall === null) {
                            lastWall = new Wall(new Vector2(x * wallWidth - halfWidth, y * wallWidth - halfWidth), new Vector2(wallWidth, 0.0001));
                        } else {
                            let currentX = x * wallWidth - halfWidth;
                            if(lastWall.pos.x + lastWall.dir.x === currentX) {
                                lastWall.dir.x += wallWidth;
                            } else {
                                this.walls.push(lastWall);
                                lastWall = new Wall(new Vector2(currentX, y * wallWidth - halfWidth), new Vector2(wallWidth, 0.0001));
                            }
                        }
                    }

                    if(this.map[x][y+1] !== 0) {
                        if(secondaryWall === null) {
                            secondaryWall = new Wall(new Vector2(x * wallWidth - halfWidth, y * wallWidth + halfWidth), new Vector2(wallWidth, 0.0001));
                        } else {
                            let currentX = x * wallWidth - halfWidth;
                            if(secondaryWall.pos.x + secondaryWall.dir.x === currentX) {
                                secondaryWall.dir.x += wallWidth;
                            } else {
                                this.walls.push(secondaryWall);
                                secondaryWall = new Wall(new Vector2(currentX, y * wallWidth + halfWidth), new Vector2(wallWidth, 0.0001));
                            }
                        }
                    }
                }
            }
            if(lastWall !== null) {
                this.walls.push(lastWall);
            }
            if(secondaryWall !== null) {
                this.walls.push(secondaryWall);
            }
        }

        //Detect vertical walls
        for(let x = 1; x < this.map.length - 1; x++) {
            let lastWall = null;
            let secondaryWall = null;
            for(let y = 1; y < this.map.length; y++) {
                if(this.map[x][y] === 0) {
                    if(this.map[x-1][y] !== 0) {
                        if(lastWall === null) {
                            lastWall = new Wall(new Vector2(x * wallWidth - halfWidth, y * wallWidth - halfWidth), new Vector2(0.0001, wallWidth));
                        } else {
                            let currentY = y * wallWidth - halfWidth;
                            if(lastWall.pos.y + lastWall.dir.y === currentY) {
                                lastWall.dir.y += wallWidth;
                            } else {
                                this.walls.push(lastWall);
                                lastWall = new Wall(new Vector2(x * wallWidth - halfWidth, currentY), new Vector2(0.0001, wallWidth));
                            }
                        }
                    }

                    if(this.map[x+1][y] !== 0) {
                        if(secondaryWall === null) {
                            secondaryWall = new Wall(new Vector2(x * wallWidth + halfWidth, y * wallWidth - halfWidth), new Vector2(0.0001, wallWidth));
                        } else {
                            let currentY = y * wallWidth - halfWidth;
                            if(secondaryWall.pos.y + secondaryWall.dir.y === currentY) {
                                secondaryWall.dir.y += wallWidth;
                            } else {
                                this.walls.push(secondaryWall);
                                secondaryWall = new Wall(new Vector2(x * wallWidth + halfWidth, currentY), new Vector2(0.0001, wallWidth));
                            }
                        }
                    }
                }
            }
            if(lastWall !== null) {
                this.walls.push(lastWall);
            }

            if(secondaryWall !== null) {
                this.walls.push(secondaryWall);
            }
        }
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