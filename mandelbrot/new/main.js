let offsets2 = {
    Mandelbrot: {
        x: 0.70,
        y: -0.35
    },
    Ship: {
        x: 1.75,
        y: 0
    }
}
let offsets = {
    Mandelbrot: {
        x: 1.41856,
        y: 0
    },
    Ship: {
        x: 1.77006,
        y: 0.05118
    }
}

let gl;
let canvas;
let program;
let zoom = 3.0;
let iterations = 50;
let current = "Mandelbrot";
window.onload = init;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function up() {
    for(let i = 1; i < 50; i++) {
        SET_ATTR_INT("ITERNUM", i);
        await sleep(100);
    }
    down();
}

async function down() {
    for(let i = 50; i > 0; i--) {
        SET_ATTR_INT("ITERNUM", i);
        await sleep(100);
    }
    up();
}

function inputChanged(value) {
    SET_ATTR_INT("ITERNUM", parseInt(value));
    iterations = parseInt(value);
}

function MandelbrotSet() {
    useShader(Mandelbrot);

    SET_ATTR_FLOAT("x_offsetU", 0.5);
    SET_ATTR_INT("ITERNUM", iterations);
    current = "Mandelbrot";
}

function MandelbrotSetJulia(x, y) {
    useShader(MandelbrotJulia);

    SET_ATTR_FLOAT("X", x);
    SET_ATTR_FLOAT("Y", y);
}

function BurningShip() {
    useShader(Ship);

    SET_ATTR_FLOAT("x_offsetU", 0.5);
    SET_ATTR_INT("ITERNUM", iterations);
    current = "Ship";
}

let animationRunning = false;
let animateIn = true;
function Animate() {
    if(!animationRunning) {
        //Run animation
        zoom = 3.0;
        SET_ATTR_FLOAT("x_offsetU", offsets[current].x);
        SET_ATTR_FLOAT("y_offsetU", offsets[current].y);
        document.getElementById('animation').innerHTML = "Stop";
        animateIn = true;
        animationRunning = true;
    } else {
        //Stop animation
        document.getElementById('animation').innerHTML = "Animate";
        animationRunning = false;
    }
}

let veryJulia = false;
function alwaysJulia() {
    if(veryJulia) {
        document.getElementById('julia').innerHTML = "Enable always Julia";
        veryJulia = false;
    } else {
        document.getElementById('julia').innerHTML = "Disable always Julia";
        veryJulia = true;
    }
}

function SET_ATTR_INT(gl_var_name, val){
    var loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform1i(loc, val);
}

function SET_ATTR_FLOAT(gl_var_name, val){
    var loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform1f(loc, val);
}

function useShader(shader) {
    //Grab and compile vertex shader
    var gl_vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl_vertexShader, shader.vertex);
    gl.compileShader(gl_vertexShader);

    //Create and compile fragment shader (Superior)
    var gl_fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl_fragmentShader, shader.fragment);
    gl.compileShader(gl_fragmentShader);

    //Create the program with the vertex and fragment shaders
    program = gl.createProgram();
    gl.attachShader(program, gl_vertexShader);
    gl.attachShader(program, gl_fragmentShader);
    gl.linkProgram(program);	
    gl.useProgram(program);

    //Set width of shader
    var loc = gl.getUniformLocation(program, "screenx");
    gl.uniform1f(loc, canvas.width);

    //Set height of shader
    loc = gl.getUniformLocation(program, "screeny");
    gl.uniform1f(loc, canvas.height);
}

function init() {
    canvas = document.getElementById("glscreen");
    gl = canvas.getContext("webgl");
    canvas.width = window.innerHeight * .98;
    canvas.height = window.innerHeight * .98;

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array([
        -1.0, -1.0, 
         1.0, -1.0, 
        -1.0,  1.0, 
        -1.0,  1.0, 
         1.0, -1.0, 
         1.0,  1.0]), 
      gl.STATIC_DRAW
    );

    useShader(Mandelbrot);

    render();
}

let lastFrame = Date.now();
function render() {
    window.requestAnimationFrame(render, canvas);

    let now = Date.now();
    let dt = now - lastFrame;
    lastFrame = now;

    if(animationRunning) {
        //Do animation stuff?

        SET_ATTR_FLOAT("ZOOM", zoom);

        if(animateIn) {
            zoom -= zoom*.003* (16/dt);
        } else {
            zoom += zoom*.003* (16/dt);
        }
        //zoom -= zoom*.003* (16/dt); // * (16/dt)

        if(zoom < 0.00001) {
            //Go back
            animateIn = false;
            //Animate();
        }

        if(zoom > 2.9 && !animateIn) {
            Animate();
        }
    }

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}