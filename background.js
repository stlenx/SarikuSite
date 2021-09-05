let canvas = document.getElementById('bannerCanvas'),
    can_w = parseInt(document.body.scrollWidth),
    can_h = parseInt(document.body.scrollHeight),
    ctx = canvas.getContext('2d');

let ball = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 0,
        alpha: 1,
        phase: 0,
        cR : 3
    },
    ball_color = {
        r: 4,
        g: 100,
        b: 255
        //4, 100, 255
        //old rgb = 207, 255,4
    },
    R = 2,
    balls = [],
    alpha_f = 0.03,
    alpha_phase = 0,

// Line
    link_line_width = 0.8,
    dis_limit = 300, //old 260
    add_mouse_point = true,
    mouse_in = false,
    mouse_ball = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 0,
        type: 'mouse'
    };

//#region Banner

let particleArray = [];
let particleSize = window.innerWidth * 0.0052;
let mouse = {
    x: null,
    y: null,
    radius: window.innerWidth * 0.078
}

{
    ctx.font = 'bold 16px Verdana';
    let gradient = ctx.createLinearGradient(0, 0, 70, 0);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(1, "blue");
    ctx.fillStyle = gradient;
    ctx.fillText('SARIKU', 5, 30);
}

const data = ctx.getImageData(0, 0, 500, 100);

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
        ctx.closePath();
        ctx.fill();
    }

    Update() {
        let distance = getDistanceBetween(new Vector2(this.x, this.y), new Vector2(mouse.x, mouse.y))

        let direction = getVector2(new Vector2(this.x, this.y), new Vector2(mouse.x, mouse.y))
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

function connect() {
    let maxD = window.innerWidth * 1.87;
    let lineWidth = window.innerWidth * 0.001;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x))
                + ((particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y));

            if (distance < maxD) {
                let opacityValue = 1 - (distance / maxD);
                let dx = mouse.x - particleArray[a].x;
                let dy = mouse.y - particleArray[a].y;
                let mouseDistance = Math.sqrt(dx * dx + dy * dy);
                if (mouseDistance < mouse.radius) {
                    particleArray[a].size = Remap(mouseDistance, 0, mouse.radius, 30, particleSize);
                } else {
                    particleArray[a].size = particleSize;
                }

                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//#endregion

// Random speed
function getRandomSpeed(pos){
    let  min = -1,
        max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
        default:
            return;
    }
}

function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}

// Random Ball
function getRandomBall(){
    let pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10),
                cR : randomNumFrom(0,255)
            }
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10),
                cR : randomNumFrom(0,255)
            }
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10),
                cR : randomNumFrom(0,255)
            }
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10),
                cR : randomNumFrom(0,255)
            }
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){

            ctx.fillStyle = 'rgba('+b.cR+','+0+','+255+','+b.alpha+')';
            //ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Update balls
function updateBalls(dt){
    let new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx * (dt / 16);
        b.y += b.vy * (dt / 16);

        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
            new_balls.push(b);
        }

        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
    });

    balls = new_balls.slice(0);
}

// Draw lines
function renderLines(){
    let fraction, alpha;
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {

            fraction = getDisOf(balls[i], balls[j]) / dis_limit;

            if(fraction < 1) {
                alpha = (1 - fraction).toString();

                ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
                ctx.lineWidth = link_line_width;

                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    let  delta_x = Math.abs(b1.x - b2.x),
        delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < 100){
        balls.push(getRandomBall());
    }
}


// Render
let lastFrame = Date.now();
function render(){
    let now = Date.now();
    let dt = now - lastFrame;
    lastFrame = now;

    ctx.clearRect(0, 0, can_w, can_h);

    renderBalls();

    renderLines();

    updateBalls(dt);

    addBallIfy();

    connect();

    particleArray.forEach((particle) => {
        particle.Update()
        particle.Draw()
    })

    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(let i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10),
            cR: randomNumFrom(0,255)
        });
    }
}

// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', Math.max(document.body.scrollWidth, window.innerWidth));
    canvas.setAttribute('height', Math.max(document.body.scrollHeight, window.innerHeight));

    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

window.addEventListener('load', function(e){
    console.log('Window loaded...');
    initCanvas();
});

function goMovie(){
    initCanvas();
    initBalls(30);
    window.requestAnimationFrame(render);
}

goMovie();

// Mouse effect
document.body.addEventListener('mouseenter', function(){
    //console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
});

document.body.addEventListener('mouseleave', function(){
    //console.log('mouseleave');
    mouse_in = false;
    let new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});

document.body.addEventListener('mousemove', function(e){
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});