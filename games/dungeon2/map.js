class Map {
    constructor(dimensions, maxTunnels, maxLength) {
        this.dimensions = dimensions;
        this.maxTunnels = maxTunnels;
        this.maxLength = maxLength;
        this.wallWidth = 200;
    }

    generateMap() {
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

    generateWalls() {
        this.walls = [];
        let halfWidth = this.wallWidth * 0.5;

        this.starting.mult(new Vector2(this.wallWidth, this.wallWidth))
        this.ending.mult(new Vector2(this.wallWidth, this.wallWidth))

        //Detect horizontal walls
        for(let y = 1; y < this.map.length; y++) {
            let lastWall = null;
            let secondaryWall = null;
            for(let x = 1; x < this.map.length; x++) {
                if(this.map[x][y] === 0) {
                    if(this.map[x][y-1] !== 0) {
                        if(lastWall === null) {
                            lastWall = new Wall(new Vector2(x * this.wallWidth - halfWidth, y * this.wallWidth - halfWidth), new Vector2(this.wallWidth, 0));
                        } else {
                            let currentX = x * this.wallWidth - halfWidth;
                            if(lastWall.pos.x + lastWall.dir.x === currentX) {
                                lastWall.dir.x += this.wallWidth;
                            } else {
                                this.walls.push(lastWall);
                                lastWall = new Wall(new Vector2(currentX, y * this.wallWidth - halfWidth), new Vector2(this.wallWidth, 0));
                            }
                        }
                    }

                    if(this.map[x][y+1] !== 0) {
                        if(secondaryWall === null) {
                            secondaryWall = new Wall(new Vector2(x * this.wallWidth - halfWidth, y * this.wallWidth + halfWidth), new Vector2(this.wallWidth, 0));
                        } else {
                            let currentX = x * this.wallWidth - halfWidth;
                            if(secondaryWall.pos.x + secondaryWall.dir.x === currentX) {
                                secondaryWall.dir.x += this.wallWidth;
                            } else {
                                this.walls.push(secondaryWall);
                                secondaryWall = new Wall(new Vector2(currentX, y * this.wallWidth + halfWidth), new Vector2(this.wallWidth, 0));
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
                            lastWall = new Wall(new Vector2(x * this.wallWidth - halfWidth, y * this.wallWidth - halfWidth), new Vector2(0, this.wallWidth));
                        } else {
                            let currentY = y * this.wallWidth - halfWidth;
                            if(lastWall.pos.y + lastWall.dir.y === currentY) {
                                lastWall.dir.y += this.wallWidth;
                            } else {
                                this.walls.push(lastWall);
                                lastWall = new Wall(new Vector2(x * this.wallWidth - halfWidth, currentY), new Vector2(0, this.wallWidth));
                            }
                        }
                    }

                    if(this.map[x+1][y] !== 0) {
                        if(secondaryWall === null) {
                            secondaryWall = new Wall(new Vector2(x * this.wallWidth + halfWidth, y * this.wallWidth - halfWidth), new Vector2(0, this.wallWidth));
                        } else {
                            let currentY = y * this.wallWidth - halfWidth;
                            if(secondaryWall.pos.y + secondaryWall.dir.y === currentY) {
                                secondaryWall.dir.y += this.wallWidth;
                            } else {
                                this.walls.push(secondaryWall);
                                secondaryWall = new Wall(new Vector2(x * this.wallWidth + halfWidth, currentY), new Vector2(0, this.wallWidth));
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