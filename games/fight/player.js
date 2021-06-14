class Player {
    constructor(x, y, s, level) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.level = level;

        this.left = false;
        this.right = false;
        this.down = false;

        this.vel = new Vector2(0,0);

        this.canJump = 0;
        this.onAir = false;

        this.canDown = false;
    }

    Jump() {
        if(this.canJump > 0) {
            this.vel.y -= 10;
            this.onAir = true;
            this.canDown = true;
            this.CheckCollisions(16)
            this.canJump--;
        }
    }

    Draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.s / this.level.size, this.s / this.level.size)
    }

    DebugDraw() {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x + (this.s / this.level.size) / 2, this.y + (this.s / this.level.size) / 2);
        ctx.lineTo((this.x + (this.s / this.level.size) / 2) + this.vel.x * 10, (this.y + (this.s / this.level.size) / 2) + this.vel.y * 10);
        ctx.stroke();
        ctx.closePath();
    }

    Update(dt) {
        let interval = dt / 16;
        this.x += this.vel.x * interval;
        this.y += this.vel.y * interval;

        //Add gravity
        this.vel.y += 0.25;

        //Add player movement
        if(this.left && this.vel.x > -10) {
            this.vel.x -= 5;
        }

        if(this.right && this.vel.x < 10) {
            this.vel.x += 5;
        }

        if(!this.right && !this.left) {
            this.vel.x = 0;
        }

        if(this.down && this.onAir && this.canDown) {
            this.vel.y += 10;
            this.canDown = false;
        }

        //Check collisions
        this.CheckCollisions(dt)
    }

    CheckCollisions(dt) {
        let interval = dt / 16;
        let x = this.x + this.vel.x * interval;
        let y = this.y + this.vel.y * interval;
        let s = this.s / this.level.size;
        this.level.blocks.forEach((block) => {
            let blockS = block.s / block.size;
            let blockX = block.x * blockS;
            let blockY = block.y * blockS;

            if(squareCollision(new Vector2(x, y), new Vector2(x + s, y + s), new Vector2(blockX, blockY), new Vector2(blockX + blockS, blockY + blockS))) {
                if(this.y+s <= blockY) { //On top of block

                    //test2 = test >>> 2;
                    if((block.posType >>> 2) % 2 === 1) {//theres a block above omg
                        if(this.x+s <= blockX) { //On left of block
                            if(block.type === 0) {
                                this.vel.x = 0;
                                this.x = blockX - blockS;
                            }
                        } else { //On right of block
                            if(block.type === 0) {
                                this.vel.x = 0;
                                this.x = blockX + blockS;
                            }
                        }
                    } else {
                        this.vel.y = 0;
                        this.y = blockY - blockS;

                        this.onAir = false; //Pretty self explanatory isn't it?
                        this.canDown = true;
                        //Reset jump (2 for double jump)
                        this.canJump = 2;
                    }
                } else if(this.x+s <= blockX) { //On left of block
                    if(block.type === 0) {
                        this.vel.x = 0;
                        this.x = blockX - blockS;
                    }
                } else if(this.x >= blockX+blockS) { //On right of block
                    if(block.type === 0) {
                        this.vel.x = 0;
                        this.x = blockX + blockS;
                    }
                } else { //Below block
                    if(block.type === 0) {
                        this.vel.y = 0;
                    }
                }
            }
        })
    }
}

function squareCollision( l1, r1, l2, r2) {
    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) return false;

    // If one rectangle is above other
    return !(l1.y >= r2.y || l2.y >= r1.y);
}