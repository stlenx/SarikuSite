class Level {
    constructor(FEN, resolution) { //When creating a level we load a FEN with a set resolution
        this.blocks = [];
        this.res = resolution;
        this.loadFEN(FEN);
    }

    loadFEN(FEN) {
        this.blocks = [];
        let size = parseInt(FEN.split(" ")[1]);
        this.size = size;

        let level = new Array(size + 2);
        for(let x = 0; x < level.length; x++) {
            level[x] = new Array(size + 2);
        }

        let line = 0;
        let column = 0;

        let positions = FEN.split(" ")[0];

        let lines = positions.split("/");

        for(let c = 0; c < lines.length; c++) {
            for(let i = 0; i < lines[c].length; i++) {
                let symbol = lines[c][i];
                if(isNaN(symbol)) {
                    switch (symbol) {
                        case "b": //Creates a solid
                            level[line + 1][c + 1] = new Solid(line, c, this.res, size);
                            //this.blocks.push(new Solid(line, column, this.res))
                            break;
                        case "s": //Creates a semi solid
                            level[line + 1][c + 1] = new SemiSolid(line, c, this.res, size);
                            //this.blocks.push(new SemiSolid(line, column, this.res))
                            break;
                    }
                    line++;
                } else {
                    let number = symbol;

                    while (!isNaN(lines[c][i+1])) {
                        number += lines[c][i+1];
                        i++;
                    }
                    line += parseInt(number);
                }
            }
            line = 0;
        }

        for(let x = 1; x < size + 1; x++) {
            for(let y = 1; y < size + 1; y++) {
                let block = level[x][y];
                if(block !== undefined) {
                    switch (block.type) {
                        case 0: //Solid
                            //Check each side for using appropriate sprite
                            if(level[x][y + 1] !== undefined && level[x][y].type === block.type) { //Check below
                                block.posType = 1 << 3 | block.posType;
                            }

                            if(level[x][y - 1] !== undefined && level[x][y].type === block.type) { //Check above
                                block.posType = 1 << 2 | block.posType;
                            }

                            if(level[x + 1][y] !== undefined && level[x][y].type === block.type) { //Check right
                                block.posType = 1 << 1 | block.posType;
                            }

                            if(level[x - 1][y] !== undefined && level[x][y].type === block.type) { //Check left
                                block.posType = 1 | block.posType;
                            }
                            break;
                        case 1: //SemiSolid
                            if(level[x + 1][y] !== undefined) { //Check right
                                block.posType = 1 << 1 | block.posType;
                            }

                            if(level[x - 1][y] !== undefined) { //Check left
                                block.posType = 1 | block.posType;
                            }
                            break;
                    }
                    this.blocks.push(block)
                }
            }
        }
    }

    LoadSprites(path = "") {
        this.blocks.forEach((block) => {
            block.LoadSprite(path);
        })
    }

    Draw() {
        this.blocks.forEach((block) => {
            block.Draw();
        })
    }
}