const canvas = document.getElementById('canvas');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

let cHeight = canvas.height;
let cWidth = canvas.width;
let boundary = 1;
let maxTrail = 25;

ctx = canvas.getContext('2d');

let fakeBall = {
    x: 500,
    y: 500,
    mass: 20000,
    color: 'red',
    pressed: false,
    mx: -200,
    my: -200
}

let predictiveBall = {
    x: 500,
    y: 500,
    mass: 20000,
    vx: 0,
    vy: 0,
    t: []
}

let sunMode = false;
let paused = false;

let planets = []

function renderObjects() {
    ctx.clearRect(0, 0, cWidth, cHeight);

    for (let i1 = 0; i1 < planets.length; i1++) {
        for (let i2 = 0; i2 < planets.length; i2++) {
            if(i1 !== i2) {
                planets[i1] = addGravity(planets[i1], planets[i2])
                if(checkCollision(planets[i1], planets[i2])) mergePlanets(i1, i2)
            }
        }

        while (planets[i1].t.length > maxTrail) planets[i1].t.splice(0, 1)

        ctx.strokeStyle = 'rgba(150,150,150,255)';
        ctx.lineWidth = 0.8;

        ctx.beginPath();

        for (let i = 0; i < planets[i1].t.length -1; i++) {
            ctx.moveTo(planets[i1].t[i].x, planets[i1].t[i].y);
            ctx.lineTo(planets[i1].t[i+1].x, planets[i1].t[i+1].y);
            ctx.stroke();
        }

        ctx.closePath();

        ctx.fillStyle = planets[i1].color;
        ctx.beginPath();
        ctx.arc(planets[i1].x, planets[i1].y, getRadius(planets[i1]), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }

    if(fakeBall.pressed) {
        ctx.fillStyle = fakeBall.color;
        ctx.beginPath();
        ctx.arc(fakeBall.x, fakeBall.y, getRadius(fakeBall), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();


        if(!sunMode) {
            ctx.strokeStyle = 'rgba(150,150,150,255)';
            ctx.lineWidth = 0.8;

            ctx.beginPath();
            ctx.moveTo(fakeBall.x, fakeBall.y);
            ctx.lineTo(fakeBall.mx, fakeBall.my);
            ctx.stroke();

            for (let i = 0; i < predictiveBall.t.length -1; i++) {
                ctx.moveTo(predictiveBall.t[i].x, predictiveBall.t[i].y);
                ctx.lineTo(predictiveBall.t[i+1].x, predictiveBall.t[i+1].y);
                ctx.stroke();
            }

            ctx.closePath();
        }
    }
}

function updateInputs() {
    maxTrail = document.getElementById('trail').value;
}

function updateObjects() {
    Array.prototype.forEach.call(planets, function (planet) {
        if(planet.planet) {
            planet.x += planet.vx;
            planet.y += planet.vy;

            planet.t.push(new Vector2(planet.x, planet.y))

            planet = boundarySystem(planet)
        }
    })
}

function boundarySystem(a) {
    switch (boundary) {
        case 0:
        {
            return a;
        }
        case 1:
        {
            let radius = getRadius(a)
            if(a.y + radius > cHeight) a.vy *= -1
            if(a.y + radius < 0) a.vy *= -1
            if(a.x + radius > cWidth) a.vx *= -1
            if(a.x + radius < 0) a.vx *= -1
            return a;
        }
        case 2:
        {
            if(a.y > 1000) a.y = 0
            if(a.y < 0) a.y = 1000
            if(a.x > 1000) a.x = 0
            if(a.x < 0) a.x = 1000
            return a;
        }
    }
}

function mergePlanets(i1,i2) {
    let index;

    if(planets[i1].planet && planets[i2].planet) {
        if(planets[i1].mass > planets[i2].mass) {
            planets[i1].mass += planets[i2].mass;
            planets[i1].vx /= 2;
            planets[i1].vy /= 2;
            index = i2;
        } else {
            planets[i2].mass += planets[i1].mass;
            planets[i2].vx /= 2;
            planets[i2].vy /= 2;
            index = i1;
        }
    } else {
        index = planets[i1].planet ? i1 : i2;
    }

    planets.splice(index, 1)
}

function checkCollision(a,b) {
    let Tr = getRadius(a) + getRadius(b)
    return Tr > getDistanceBetween(a, b);
}

function getRadius(planet) {
    return planet.mass / 5000;
}

function addGravity(a,b) {
    let force = getGravitationalForce(a, b)

    let direction = getVector2(a, b)
    //direction.normalize()
    direction.x *= (force * 100)
    direction.y *= (force * 100)

    a.vx += direction.x
    a.vy += direction.y

    return a;
}

function getVector2(a, b) {
    return new Vector2(b.x - a.x, b.y - a.y)
}

function getGravitationalForce(a,b) {
    let r = getDistanceBetween(a,b)
    let G = 6.674 * Math.pow(10, -11)
    return G * ((a.mass * b.mass) / (r * r))
}

function getDistanceBetween(a, b) {
    return Math.sqrt( ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)) )
}

function predictTrail() {
    predictiveBall.t = [];
    predictiveBall.x = fakeBall.x;
    predictiveBall.y = fakeBall.y;
    predictiveBall.vx = 0;
    predictiveBall.vy = 0;

    let vector = getVector2({x: fakeBall.mx, y: fakeBall.my},{x: fakeBall.x, y: fakeBall.y})
    predictiveBall.vx = vector.x / 10;
    predictiveBall.vy = vector.y / 10;

    for (let t = 0; t < 100; t++) {
        for (let i = 0; i < planets.length; i++) {
            predictiveBall = addGravity(predictiveBall, planets[i])
            if(!planets[i].planet && checkCollision(predictiveBall, planets[i])) return;
        }

        predictiveBall.x += predictiveBall.vx;
        predictiveBall.y += predictiveBall.vy;

        predictiveBall.t.push(new Vector2(predictiveBall.x, predictiveBall.y))

        predictiveBall = boundarySystem(predictiveBall)
    }
}

canvas.addEventListener("mousemove", function (e) {
    fakeBall.mx = e.offsetX;
    fakeBall.my = e.offsetY;
    predictTrail()
})

canvas.addEventListener("mousedown", function (e) {
    fakeBall.x = e.offsetX;
    fakeBall.y = e.offsetY;
    fakeBall.mx = e.offsetX;
    fakeBall.my = e.offsetY;
    predictiveBall.x = e.offsetX;
    predictiveBall.y = e.offsetY;
    predictiveBall.mass = fakeBall.mass;
    predictTrail()
    fakeBall.pressed = true;
});

canvas.addEventListener("mouseup", function (e) {
    let vector = getVector2({x: e.offsetX, y: e.offsetY},{x: fakeBall.x, y: fakeBall.y})
    if(sunMode) {
        planets.push(createPlanet(fakeBall.x, fakeBall.y, 0,0, fakeBall.mass, 'yellow', false))
    } else {
        planets.push(createPlanet(fakeBall.x, fakeBall.y, vector.x / 10,vector.y / 10, fakeBall.mass, 'blue', true))
    }

    fakeBall.pressed = false;
    fakeBall.mass = 20000;
});

function scrollMass(e) {
    let y = e.deltaY;
    if(fakeBall.pressed) {
        if (y > 0) {
            fakeBall.mass -= 3000;
            if(fakeBall.mass < 0)
                fakeBall.mass = 1000;
        } else {
            fakeBall.mass += 3000;
        }
        predictiveBall.mass = fakeBall.mass;
    }
}

document.addEventListener("keydown", event => {
    if(event.key === 's')
        sunMode = !sunMode;
});

function initCanvas(){
    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)

    cWidth = parseInt(canvas.getAttribute('width'));
    cHeight = parseInt(canvas.getAttribute('height'));
}

window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

function pause() {
    if(paused) {
        paused = false;
        document.getElementById('pause').innerHTML = "Pause";
    } else {
        paused = true;
        document.getElementById('pause').innerHTML = "Unpause";
    }
}

function createPlanet(x,y,vx,vy,mass, color, planet) {
    return {
        x: x,
        y: y,
        mass: mass,
        color: color,
        vx: vx,
        vy: vy,
        planet: planet,
        t: []
    }
}

function frame() {

    updateInputs()

    if(!paused) {
        renderObjects()

        updateObjects()
    }

    window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame);