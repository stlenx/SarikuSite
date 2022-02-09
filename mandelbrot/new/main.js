let offsets = {
    Mandelbrot: { //-0.31750109, 0.48999993, 0.00000000000000588, 0.0
        x: 1.2485, //1.25698
        y: 0.01278 //0.37948
    },
    Ship: {
        x: 1.27006,
        y: 0.05118
    }
}

let canvas = document.getElementById("glscreen");
let gl = canvas.getContext("webgl");
let program;
let res;

let zoom = 3.0;
let iterations = 500;
let smoothReuslt = false;
let colorFunction = 0;
let current = "Mandelbrot";

window.onload = init;

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

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

    SET_ATTR_INT("ITERNUM", iterations);
    SET_ATTR_INT("whichColor", colorFunction);
    SET_ATTR_INT("smoothResult", smoothReuslt);
    current = "Mandelbrot";
}

function BurningShip() {
    useShader(Ship);

    SET_ATTR_INT("ITERNUM", iterations);
    SET_ATTR_INT("whichColor", colorFunction);
    SET_ATTR_INT("smoothResult", smoothReuslt);
    current = "Ship";
}

function UpdateJulia(x, y) {
    SET_ATTR_VEC2F("POS", x / res, y / res);
    SET_ATTR_INT("ITERNUM", iterations);
    SET_ATTR_INT("whichColor", colorFunction);
    SET_ATTR_INT("smoothResult", smoothReuslt);
}

function smoothMaybe(bool) {
    SET_ATTR_INT("smoothResult", bool);
    smoothReuslt = bool;
}

function changeColoring(coloring) {
    SET_ATTR_INT("whichColor", coloring);
    colorFunction = coloring;
}

let animationRunning = false;
let animateIn = true;
function Animate() {
    if(!animationRunning) {
        //Run animation
        zoom = 3.0;
        SET_ATTR_VEC2F("PAN", offsets[current].x, offsets[current].y);
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
        switch (current) {
            case "Mandelbrot":
            {
                useShader(MandelbrotJulia);
                UpdateJulia(0, 0);
                break;
            }
            case "Ship":
            {
                useShader(ShipJulia);
                UpdateJulia(0, 0);
                break;
            }
            default:
                break;
        }
        UpdateJulia(0, 0);
        veryJulia = true;
    }
}


canvas.addEventListener("mousemove", (ev => {
    if(veryJulia) {
        UpdateJulia(ev.offsetX, ev.offsetY);
    }
}))

function SET_ATTR_INT(gl_var_name, val){
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform1i(loc, val);
}

function SET_ATTR_FLOAT(gl_var_name, val){
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform1f(loc, val);
}

function SET_ATTR_VEC4F(gl_var_name, val1, val2, val3, val4) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform4f(loc, val1, val2, val3, val4);
}

function SET_ATTR_VEC3F(gl_var_name, val1, val2, val3) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform3f(loc, val1, val2, val3);
}

function SET_ATTR_VEC2F(gl_var_name, val1, val2) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.useProgram(program);
    gl.uniform2f(loc, val1, val2);
}

function useShader(shader) {
    //Grab and compile vertex shader
    let gl_vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl_vertexShader, shader.vertex);
    gl.compileShader(gl_vertexShader);

    //Create and compile fragment shader (Superior)
    let gl_fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl_fragmentShader, shader.fragment);
    gl.compileShader(gl_fragmentShader);

    //Create the program with the vertex and fragment shaders
    program = gl.createProgram();
    gl.attachShader(program, gl_vertexShader);
    gl.attachShader(program, gl_fragmentShader);
    gl.linkProgram(program);	
    gl.useProgram(program);

    //Set resolution of shader
    let loc = gl.getUniformLocation(program, "iResolution");
    gl.uniform2f(loc, canvas.width, canvas.height);
}

function init() {
    let isMobile = window.mobileCheck();

    if(isMobile) {
        res = Math.min(window.innerWidth, window.innerHeight);
    } else {
        res = Math.min(window.innerWidth, window.innerHeight) * .98;
    }

    canvas.width = res;
    canvas.height = res;

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

    changeColoring(1);

    render();
}

let lastFrame = Date.now();
function render() {
    window.requestAnimationFrame(render);

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

        if(zoom < 0.00001) { //0.00000000000000001 with dp 0.00001 without
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