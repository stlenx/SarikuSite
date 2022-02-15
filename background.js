let canvas = document.getElementById('background');
let canvas2d = document.getElementById('bannerCanvas');
let gl = canvas.getContext("webgl");
let ctx = canvas2d.getContext("2d");

let mouse = {
    x: null,
    y: null,
    radius: window.innerWidth * 0.078
}

//#region Banner

let particleArray = [];
let particleSize = window.innerWidth * 0.0052;

let data;

class Particle {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = particleSize;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = ((Math.random() * 60) + 1);
    }

    Draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    Update() {
        let direction = getVector2(new Vector2(this.x, this.y), new Vector2(mouse.x, mouse.y))

        let distance = direction.Length();

        direction = new Vector2(direction.x / distance, direction.y / distance)

        // distance past which the force is zero
        let force = (mouse.radius - distance) / mouse.radius;

        // if we went below zero, set it to zero.
        force = force < 0 ? 0 : force;

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
    let gradient = ctx.createLinearGradient(0, 0, 70, 0);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(1, "blue");
    ctx.fillStyle = gradient;
    ctx.fillText('SARIKU', 5, 30);
    data = ctx.getImageData(0, 0, 500, 100);

    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x++) {
            if (data.data[((x + y * data.width) * 4) + 3] > 128) {
                let index = (x + y * data.width) * 4;
                let R = data.data[index];
                let G = data.data[index + 1];
                let B = data.data[index + 2];
                let color = "rgb(" + R + "," + G + "," + B + ")";
                particleArray.push(new Particle(x * (window.innerWidth * 0.0078) - (window.innerWidth * 0.057) + (window.innerWidth /4), y * (window.innerWidth * 0.0078) - (window.innerWidth * 0.078), color));
            }
        }
    }
}

doText();

function connect() {
    let maxD = window.innerWidth * 2;
    let minD = window.innerWidth * 1.2;

    ctx.lineWidth = window.innerWidth * 0.001;

    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
                + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));

            if (distance < maxD && distance > minD) {
                let opacityValue = 1 - (distance / maxD);
                let dx = mouse.x - particleArray[a].x;
                let dy = mouse.y - particleArray[a].y;
                let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                if (mouseDistance < mouse.radius) {
                    particleArray[a].size = Remap(mouseDistance, 0, mouse.radius, 30, particleSize);
                } else {
                    particleArray[a].size = particleSize;
                }

                ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`;

                ctx.beginPath();

                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);

                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}


//#endregion

//#region METABALLS
let Metaballs = {
    vertex: `
  attribute vec2 a_position;
  void main() {
      gl_Position = vec4(a_position, 0, 1);
  }
  `,
    fragment: `
  precision highp float;

  uniform vec3 metaballs[30]; //Hard coding for now
  uniform vec2 iResolution;
  uniform vec3 backgroundColor;

  void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    
    float sum = 0.0;

    for (int i = 0; i < 30; i++) {
      vec3 metaball = metaballs[i];
      float dx = metaball.x - x;
      float dy = metaball.y - y;
      float radius = metaball.z;
      
      sum += (radius * radius) / (dx * dx + dy * dy);
    }
    
    if (sum >= 0.99) {
        gl_FragColor = vec4(mix(vec3(x / iResolution.x, y / iResolution.y, 1.0), backgroundColor, max(0.0, 1.0 - (sum - 0.99) * 100.0)), 1.0);
        return;
    }
    
    gl_FragColor = vec4(0.0);
  }
  `
}

let program;

let numMetaballs = 30;
let metaballs = [];

initCanvas();

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

function SET_ATTR_VEC3F(gl_var_name, val1, val2, val3) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.uniform3f(loc, val1, val2, val3);
}

function SET_ATTR_3FV(gl_var_name, val) {
    let loc = gl.getUniformLocation(program, gl_var_name);
    gl.uniform3fv(loc, val);
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

    SET_ATTR_3FV("metaballs", dataToSendToGPU);
}

function DrawMetaballs() {
    let color = window.getComputedStyle( document.body ,null).getPropertyValue('background-color');
    let colors = color.replace("rgb(", "").replace(")", "").split(",")

    let r = Remap(parseInt(colors[0]), 0, 255, 0, 1);
    let g = Remap(parseInt(colors[1]), 0, 255, 0, 1);
    let b = Remap(parseInt(colors[2]), 0, 255, 0, 1);

    SET_ATTR_VEC3F("backgroundColor", r, g, b);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

//#region INIT
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

useShader(Metaballs);
//#endregion


//#endregion

// Render
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particleArray.forEach((particle) => {
        particle.Update()
        particle.Draw()
    })

    UpdateMetaballs();

    DrawMetaballs();

    window.requestAnimationFrame(render);
}

// Init Canvas
function initCanvas(){
    let body = document.body,
        html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1.8;


    canvas2d.width = window.innerWidth;
    canvas2d.height = window.innerHeight * 1.8;
    useShader(Metaballs);
}

window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
    doText();
});

window.addEventListener('load', function(e){
    console.log('Window loaded...');
    initCanvas();
});

function goMovie() {
    initCanvas();
    window.requestAnimationFrame(render);
}

goMovie();

document.body.addEventListener('mousemove', function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});