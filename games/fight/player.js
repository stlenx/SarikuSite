class Player {
    constructor(x, y, s, level, color) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.level = level;
        this.color = color;

        this.hp = 100;

        this.left = false;
        this.right = false;
        this.down = false;
        this.up = false;
        this.action1 = false;

        this.vel = new Vector2(0,0);
        this.dir = new Vector2(0,0);

        this.canJump = 0;
        this.onAir = false;

        this.canDown = false;

        this.movementOffset = (this.level.size * 0.1);
    }

    get Direction() {
        return this.dir.ReturnNormalized();
    }

    Jump() {
        if(this.canJump > 0) {
            this.vel.y -= 10 / this.movementOffset;
            this.onAir = true;
            this.canDown = true;
            this.CheckCollisions(16)
            this.canJump--;
        }
    }

    Attack() {
        let dir = this.Direction;
        dir.Scale(this.s / this.level.size);
        let s = (this.s / this.level.size) / 2;

        let pos = new Vector2(this.x + s + dir.x, this.y + s + dir.y) //Center point

        players.forEach((player) => {
            if(player === this) return;
            if(squareCollision(
                new Vector2(pos.x - s, pos.y - s),
                new Vector2(pos.x + s, pos.y + s),
                new Vector2(player.x, player.y),
                new Vector2(player.x + s*2, player.y + s*2))) {

                player.hp -= 15;
            }
        })
    }

    Draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.s / this.level.size, this.s / this.level.size)

        ctx.fillStyle = "#1a1a1a";
        let width = this.s * 0.2;

        ctx.fillRect(this.x + ((this.s / this.level.size) / 2) - width / 2, this.y - ((this.s / this.level.size) * 0.2) * 2, width, (this.s / this.level.size) * 0.2)


        ctx.fillStyle = "green";
        let health = Remap(this.hp, 0, 100, 0, width);
        health = Clamp(health, 0, width)
        ctx.fillRect(this.x + ((this.s / this.level.size) / 2) - width / 2, this.y - ((this.s / this.level.size) * 0.2) * 2, health, (this.s / this.level.size) * 0.2)
    }

    DebugDraw() {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x + (this.s / this.level.size) / 2, this.y + (this.s / this.level.size) / 2);

        let dir = this.Direction;
        dir.Scale(this.s / this.level.size);
        ctx.lineTo((this.x + (this.s / this.level.size) / 2) + dir.x, (this.y + (this.s / this.level.size) / 2) + dir.y);
        ctx.stroke();
        ctx.closePath();
    }

    Update(dt) {
        let interval = dt / 16;
        this.x += this.vel.x * interval;
        this.y += this.vel.y * interval;

        //Add gravity
        this.vel.y += 0.25  / this.movementOffset;

        //Add player movement
        if(this.left && this.vel.x > -10  / this.movementOffset) {
            this.vel.x -= 5  / this.movementOffset;
            this.dir.x -= 10 / this.movementOffset
        }

        if(this.right && this.vel.x < 10  / this.movementOffset) {
            this.vel.x += 5  / this.movementOffset;
            this.dir.x += 10 / this.movementOffset
        }

        //If you're not going either left or right stop
        if(!this.right && !this.left) {
            this.vel.x = 0;
            this.dir.x = 0;
        }

        if(this.down && this.onAir && this.canDown) {
            this.vel.y += 10  / this.movementOffset;
            this.canDown = false;
        }

        if(this.down) {
            this.dir.y = 10 / this.movementOffset
        }

        if (this.up) {
            this.dir.y = -10 / this.movementOffset;
        }

        if(!this.down && !this.up) {
            this.dir.y = 0;
        }

        if(this.hp <= 0) { //if you die, respawn
            this.hp = 100;
            this.x = this.s / 2;
            this.y = 0;

            this.vel = new Vector2(0,0);
        }

        if(this.y > this.s * 2) { //If you fall off the map, die
            this.hp = 0;
        }

        //ATTACK
        if(this.action1) {
            this.Attack()
            this.action1 = false;
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
                    } else { //On top of block yayy
                        if(block.type === 0) {
                            this.vel.y = 0;
                            this.y = blockY - blockS;

                            this.onAir = false; //Pretty self explanatory isn't it?
                            this.canDown = true;
                            //Reset jump (2 for double jump)
                            this.canJump = 2;
                        } else { //Special behaviour for semi solids
                            if(this.y + s !== blockY || !this.down) { //Go through lol
                                this.vel.y = 0;
                                this.y = blockY - blockS;

                                this.dir.y = 0;
                                this.onAir = false; //Pretty self explanatory isn't it?
                                this.canDown = true;
                                //Reset jump (2 for double jump)
                                this.canJump = 2;
                            }
                        }
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