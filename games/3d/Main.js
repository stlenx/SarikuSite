let canvas = document.getElementById("scene")
//canvas.setAttribute('width', window.innerWidth);
//canvas.setAttribute('height', window.innerHeight);
let ctx = canvas.getContext('webgl');

const gl = canvas.getContext("webgl")

gl.clearColor(1.0,1.0,1.0, 1.0)

gl.clear(gl.COLOR_BUFFER_BIT)

