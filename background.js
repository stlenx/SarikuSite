// Function that returns a Promise for the FPS
let fps;
const getFPS = () =>
    new Promise(resolve =>
        requestAnimationFrame(t1 =>
            requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
        )
    )

// Calling the function to get the FPS
function loadFPS() {
    getFPS().then(fpsS => fps = fpsS);
}

loadFPS();


let canvas = document.getElementById('background');
let gl = canvas.getContext("webgl");
let ctx = document.createElement("canvas").getContext("2d");

let mouse = {
    x: null,
    y: null,
    radius: window.innerWidth * 0.078
}
let performanceMode = false;
let particleArray = [];
let particleSize = window.innerWidth * 0.0052;
let program;
let data;

//#region Shaders

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
    SET_ATTR_VEC2F("iResolution", canvas.width, canvas.height);
}

function SET_ATTR_VEC2F(gl_var_name, val1, val2) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.uniform2f(loc, val1, val2);
}

function SET_ATTR_3FV(gl_var_name, val) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.uniform3fv(loc, val);
}

//#endregion

//#region Banner

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = particleSize;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = ((Math.random() * 60) + 1);
    }

    Update() {
        let direction = getVector2(new Vector2(this.x, this.y), new Vector2(mouse.x, mouse.y))

        let distance = direction.Length();

        direction = new Vector2(direction.x / distance, direction.y / distance)

        // distance past which the force is zero
        let force = (mouse.radius - distance) / mouse.radius;

        // if we went below zero, set it to zero.
        force = Math.max(force, 0);

        direction.mult(new Vector2(force * this.density, force * this.density))

        if (distance < mouse.radius + this.size){
            this.x -= direction.x;
            this.y -= direction.y;
            return;
        }

        if (this.x !== this.baseX ) {
            let dx = this.x - this.baseX;
            this.x -= dx/10;
        }

        if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy/10;
        }
    }
}

function doText() {
    particleArray = [];
    particleSize = window.innerWidth * 0.0052;
    mouse.radius = window.innerWidth * 0.078;

    ctx.font = 'bold 16px Verdana';
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText('SARIKU', 5, 30);
    data = ctx.getImageData(0, 0, 500, 100);

    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x++) {
            if (data.data[((x + y * data.width) * 4) + 3] > 128) {
                //particleArray.push(new Particle(x * (window.innerWidth * 0.0078) - (window.innerWidth * 0.057) + (window.innerWidth /4), y * (window.innerWidth * 0.0078) - (window.innerWidth * 0.078), color));
                //let finalY = (y * (-window.innerWidth * 0.0078)) + window.innerWidth * 1.25;
                let finalY = (-(y * (window.innerWidth * 0.0078) - (window.innerWidth * 0.078))) + window.innerHeight * 0.8;
                particleArray.push(new Particle(x * (window.innerWidth * 0.0078) - (window.innerWidth * 0.057) + (window.innerWidth /4), finalY));
            }
        }
    }
}

doText();

let CanvasShader = {
    vertex: `
  attribute vec2 a_position;
  void main() {
      gl_Position = vec4(a_position, 0, 1);
  }
  `,
    fragment: `
  precision highp float;

  uniform vec3 metaballs[`+ particleArray.length +`]; //Hard coding for now
  uniform vec3 background[15]; //Background stuff
  uniform vec2 iResolution;

  void main(){
    gl_FragColor = vec4(0.0);
  
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    
    float summing = 0.0;
    
    for (int i = 0; i < 15; i++) {
      vec3 metaball = background[i];
      float dx = metaball.x - x;
      float dy = metaball.y - y;
      float radius = metaball.z;
      
      summing += (radius * radius) / (dx * dx + dy * dy);
    }
    
    if (summing >= 0.99) {
        //gl_FragColor = vec4(mix(vec3(x / iResolution.x, y / iResolution.y, 1.0), backgroundColor, max(0.0, 1.0 - (summing - 0.99) * 100.0)), 1.0);
        gl_FragColor = mix(vec4(x / iResolution.x, y / iResolution.y, 1.0, 1.0), vec4(0.0), max(0.0, 1.0 - (summing - 0.99) * 100.0));
    }
    
    float sum = 0.0;

    for (int i = 0; i < `+ particleArray.length +`; i++) {
      vec3 metaball = metaballs[i];
      float dx = metaball.x - x;
      float dy = metaball.y - y;
      float radius = metaball.z;
      
      sum += (radius * radius) / (dx * dx + dy * dy);
    }
    
    if (sum >= 0.99) {
        vec4 col = mix(vec4(x / iResolution.x, -y / iResolution.y, 1.0, 1.0), vec4(0.0), max(0.0, 1.0 - (sum - 0.99) * 100.0));
        
        gl_FragColor = col;
    }
    
    float limit = iResolution.y * 0.25;
    if(y < limit) {
        if(gl_FragColor.xyz != vec3(0.0)) {
            float t = y / limit;
            gl_FragColor.w = t;
        }
    }
  }
  `
}


function UpdateText() {
    particleArray.forEach((particle) => {
        particle.Update()
        //particle.Draw() //Slow 1.0 - 0.6ms
        //Just dont mate there we go we speed
    })

    let dataToSendToGPU = new Float32Array(3 * particleArray.length);
    for (let i = 0; i < particleArray.length; i++) {
        let baseIndex = 3 * i;
        let mb = particleArray[i];
        dataToSendToGPU[baseIndex] = mb.x;
        dataToSendToGPU[baseIndex + 1] = mb.y;
        dataToSendToGPU[baseIndex + 2] = window.innerWidth * 0.0025; //5
    }

    SET_ATTR_3FV("metaballs", dataToSendToGPU);
}

function DrawGL() {
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function InitGL() {
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

    useShader(CanvasShader);
}

//#endregion

//#region METABALLS
let numMetaballs = 15;
let metaballs = [];

initCanvas();

function UpdateMetaballs() {
    metaballs.forEach(metaball => {
        metaball.x += metaball.vx;
        metaball.y += metaball.vy;

        if (metaball.x < metaball.r || metaball.x > canvas.width - metaball.r) metaball.vx *= -1;
        if (metaball.y < metaball.r || metaball.y > canvas.height - metaball.r) metaball.vy *= -1;
    })

    let dataToSendToGPU = new Float32Array(3 * numMetaballs);
    for (let i = 0; i < numMetaballs; i++) {
        let baseIndex = 3 * i;
        let mb = metaballs[i];
        dataToSendToGPU[baseIndex] = mb.x;
        dataToSendToGPU[baseIndex + 1] = mb.y;
        dataToSendToGPU[baseIndex + 2] = mb.r;
    }

    SET_ATTR_3FV("background", dataToSendToGPU);
}

//#region INIT
function GenerateMetaballs() {
    metaballs = [];
    for (let i = 0; i < numMetaballs; i++) {
        let radius = Math.random() * 60 + 40;
        metaballs.push({
            x: Math.random() * (canvas.width - 2 * radius) + radius,
            y: Math.random() * (canvas.height - 2 * radius) + radius,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            r: radius * 0.75
        });
    }
}

//#endregion


//#endregion

// Render
let lastFrame = Date.now();
let numberOfSuggestions = 0;
let firstSuggestion = Date.now();
let alreadySuggested = false;
function render(){
    let now = Date.now();
    let dt = now - lastFrame;
    lastFrame = now;

    let currentFps = 1000 / dt;

    if(currentFps < fps * 0.9) {
        if(!alreadySuggested) {
            if(numberOfSuggestions > 50) {
                if((now - firstSuggestion) < 7000) {
                    suggestPerformanceMode()
                    alreadySuggested = true;
                    console.log("Actually suggest lol")
                }
                alreadySuggested = true;
            }

            numberOfSuggestions++;
            if(numberOfSuggestions < 5) {
                firstSuggestion = Date.now()
            }
        }
    }

    //console.time("particle updates")

    UpdateText();

    UpdateMetaballs();

    DrawGL();

    //console.timeEnd("particle updates")

    if(performanceMode) return;

    window.requestAnimationFrame(render);
}
// Init Canvas
function initCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;

    InitGL();
    GenerateMetaballs();
}

window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
    doText();
});

function goMovie() {
    initCanvas();
    window.requestAnimationFrame(render);
}

loadFPS();

goMovie();

document.body.addEventListener('mousemove', function(e){
    //(y * (-window.innerWidth * 0.0078)) + window.innerWidth * 1.25;
    mouse.x = e.pageX;
    mouse.y =  (-e.pageY) + window.innerHeight * 0.8;
});

function togglePerformanceMode() {
    if(performanceMode) {
        performanceMode = false;
        goMovie();
        return;
    }
    performanceMode = true;
}

function changePerformanceMode(bool) {
    performanceMode = bool;
    if (!bool) {
        goMovie();
    }
}

function suggestPerformanceMode() {
    displayErrorMessage("Enable performance mode at the bottom", "white", "black", 2000)
}