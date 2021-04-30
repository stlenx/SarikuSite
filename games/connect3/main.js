let canvas = document.getElementById("canvas");
canvas.setAttribute('width', window.innerHeight)
canvas.setAttribute('height', window.innerHeight)
let ctx = canvas.getContext('2d')

let board = new Board(canvas.width, canvas.height, 1, 10)

canvas.addEventListener("mousedown", (e) => {
    let posX = 0;
    let posY = 0;
    switch (true) {
        case e.offsetX < canvas.width / 3:
            posX = 0;
            break;
        case e.offsetX < (canvas.width / 3) * 2:
            posX = 1;
            break;
        case e.offsetX < (canvas.width / 3) * 3:
            posX = 2;
            break;
    }

    switch (true) {
        case e.offsetY < canvas.height / 3:
            posY = 0;
            break;
        case e.offsetY < (canvas.height / 3) * 2:
            posY = 1;
            break;
        case e.offsetY < (canvas.height / 3) * 3:
            posY = 2;
            break;
    }

    if(board.b[posX][posY] === 0 && board.winner === null) {
        board.b[posX][posY] = board.turn;
        board.turn = board.turn === 1 ? 2 : 1;
        board.Draw()
        board.Update()
        if(board.winner !== null) board.Win()
        board.AiTurn()
        board.Draw()
        board.Update()
        if(board.winner !== null) board.Win()
    }
})