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

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};


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
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  precision mediump int;

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

if(!window.mobileCheck()) {
    initCanvas();
}

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
    if(!window.mobileCheck()) {
        console.log('Window Resize...');
        initCanvas();
        doText();
    }
});

function goMovie() {
    if(!window.mobileCheck()) {
        initCanvas();
        window.requestAnimationFrame(render);
    }
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