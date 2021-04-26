let canvas = document.getElementById("canvas");
canvas.setAttribute('width', window.innerHeight)
canvas.setAttribute('height', window.innerHeight)
let ctx = canvas.getContext('2d')

let board = new Board(canvas.width, canvas.height)

function frame() {
    Draw()

    window.requestAnimationFrame(frame)
}

function Draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height)

    board.Draw()
}

window.requestAnimationFrame(frame)