class Scene {
    //vertex shader - Convert vertex positions to clip space
    vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }`;

    //Fragment shader - Get the appropriate color for each pixel
    fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }`;

    constructor(gl, camera) {
        this.camera = camera;
        this.objects = [];
        this.gl = gl;

        this.gl.clearColor(0.0,0.0,0.0, 1.0)
        this.gl.clear(gl.COLOR_BUFFER_BIT)

        this.shaderProgram = this.initShader();

        this.buffers = this.initBuffers(gl)

        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor')
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix')
            }
        };

        this.buffers = this.initBuffers()
    }

    AddObject(object) {
        this.objects.push(object)
    }

    Draw() {
        this.gl.clearColor(0.0,0.0,0.0,1.0) //Clear the scene
        this.gl.clearDepth(1.0) //Clear everything
        this.gl.enable(this.gl.DEPTH_TEST) //Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL) //Near things obscure far things

        //Clear the canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        const fieldOfView = 45 * Math.PI / 180; //Radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1; //Close cut off
        const zFar = 100.0; //Far cut off
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0,0.0,-6.0]); //Destination matrix, matrix to translate, amount to translate

        mat4.translate(modelViewMatrix, modelViewMatrix, [position.x, position.y, position.z]);

        mat4.rotate(modelViewMatrix, modelViewMatrix, rotationX * 0.7, [0,1,0])

        mat4.rotate(modelViewMatrix, modelViewMatrix, rotationY * 0.7, [1,0,0])

        mat4.rotate(modelViewMatrix, modelViewMatrix, rotationZ * 0.7, [0,0,1])

        {
            const numComponents = 3; //Pull 3 values per iteration
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position)
            this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset)
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition)
        }

        //Do the color shit
        {
            const numComponents = 4;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color)
            this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset)
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor)
        }

        this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        {
            const vertexCount = 36;
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset)
        }

        this.gl.useProgram(this.programInfo.program)

        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

        {
            const offset = 0;
            const vertexCount = 4;
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount)
        }
    }

    initShader() {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vsSource);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource);

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader)
        this.gl.attachShader(shaderProgram, fragmentShader)
        this.gl.linkProgram(shaderProgram)

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    initBuffers() {
        //Create a buffer for the positions
        const positionBuffer = this.gl.createBuffer();

        //Select the positionBuffer as the one to apply operations on
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

        //Square positions
        const positions = [
            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];

        //Pass the positions to WebGL to build the shape
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)

        const faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red
            [0.0,  1.0,  0.0,  1.0],    // Top face: green
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0]    // Left face: purple
        ];

        let colors = [];

        for (let i = 0; i < faceColors.length; i++) {
            const c = faceColors[i];

            colors = colors.concat(c,c,c,c);
        }

        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW)

        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

        const indices = [
            0, 1, 2,    0, 2, 3,    //Front
            4, 5, 6,    4, 6, 7,    //Back
            8, 9, 10,   8, 10, 11,  //Top
            12, 13, 14, 12, 14, 15, //Bottom
            16, 17, 18, 16, 18, 19, //Right
            20, 21, 22, 20, 22, 23  //Left
        ]

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW)

        return {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer
        }
    }

    loadShader(type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source)

        gl.compileShader(shader)

        return shader;
    }
}