class Board {
    constructor(w, h, turn, depth) {
        this.w = w;
        this.h = h;
        this.b = new Array(3)
        this.winner = null;
        this.turn = turn;
        this.depth = depth--;
        if(depth - 1 > 0) {
            let Nturn = turn === 1 ? 2 : 1;
            this.VB = new Board(w,h, Nturn, depth--)
        }

        for (let x = 0; x < 3; x++) {
            this.b[x] = new Array(3);
            for (let y = 0; y < 3; y++) {
                this.b[x][y] = 0;
            }
        }
        console.log(this.b)

        ctx.fillStyle = "black";
        ctx.fillRect(0,0,this.w,this.h)

        //Draw lines
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath()
        let size = this.w / 3;
        for (let i=1; i < 3; i++) {
            ctx.moveTo(size * i,0)
            ctx.lineTo(size * i,this.h)
            ctx.moveTo(0,size * i)
            ctx.lineTo(this.w,size * i)
        }
        ctx.stroke()
        ctx.closePath()
    }

    AiTurn() {
        if(this.winner !== null) return;
        if(this.VB === undefined) return;


        this.VB.turn = this.turn === 1 ? 2 : 1;

        let moves = this.Evaluate()

        let move = moves.points.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

        console.log(moves.moves, move, this.depth)
        console.log(moves.points)

        this.b[moves.moves[move].x][moves.moves[move].y] = this.turn;
        this.turn = this.turn === 1 ? 2 : 1;
    }

    Evaluate() {
        let moves = [];
        let points = [];

        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {

                if(this.b[x][y] === 0 && this.VB !== undefined) {
                    for(let x2 = 0; x2 < 3; x2++) {
                        for(let y2 = 0; y2 < 3; y2++) {
                            this.VB.b[x2][y2] = this.b[x2][y2]
                        }
                    }

                    this.VB.b[x][y] = this.turn;
                    this.VB.AiTurn()
                    this.VB.Update()

                    switch (this.VB.winner) {
                        case this.turn:
                            moves.push({x, y})
                            points.push(9999)
                            break;
                        case this.VB.turn:
                            moves.push({x, y})
                            points.push(-9999)
                            break;
                        default:
                            moves.push({x, y})
                            points.push(0)
                            break;
                    }
                }
            }
        }
        return {moves, points};
    }

    Update() {
        let tru = 0;

        //Check vertically
        for (let x = 0; x < 3; x++) {
            if(this.b[x][0] !== 0 && this.b[x][0] === this.b[x][1] && this.b[x][0] === this.b[x][2]) {
                tru = this.b[x][0]
            }
        }

        //Check horizontally
        for (let y = 0; y < 3; y++) {
            if(this.b[0][y] !== 0 && this.b[0][y] === this.b[1][y] && this.b[0][y] === this.b[2][y]) {
                tru = this.b[0][y]
            }
        }

        //Check diagonal
        if(this.b[0][0] !== 0 && this.b[0][0] === this.b[1][1] && this.b[0][0] === this.b[2][2]) tru = this.b[0][0];
        if(this.b[2][0] !== 0 && this.b[2][0] === this.b[1][1] && this.b[2][0] === this.b[0][2]) tru = this.b[2][0];

        if(tru !== 0) this.winner = tru;
    }

    Win() {
        switch (this.winner) {
            case 1:
                ctx.fillStyle = "GREEN"
                ctx.font = `100px Helvetica`;
                ctx.fillText("◯ player WINNSS", this.w / 2, this.h / 2)
                break;
            case 2:
                ctx.fillStyle = "GREEN"
                ctx.font = `100px Helvetica`;
                ctx.fillText("✕ player WINNSS", this.w / 2, this.h / 2)
                break;
        }
    }

    Draw() {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.font = `300px Helvetica`;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                switch (this.b[x][y]) {
                    case 1:
                        ctx.fillText("◯", (this.w / 3) * x + (this.w / 3) / 2, ((this.h / 3) * y + (this.w / 3) / 2) + 300 * 0.066);
                        break;
                    case 2:
                        ctx.fillText("✕", (this.w / 3) * x + (this.w / 3) / 2, ((this.h / 3) * y + (this.w / 3) / 2) + 300 * 0.066);
                        break;
                    case 0:
                        break;
                }
            }
        }
    }
}