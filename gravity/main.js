const canvas = document.getElementById('canvas');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

let cHeight = canvas.height;
let cWidth = canvas.width;

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

let sunMode = false;

let planets = []

function renderObjects() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0, 0, cWidth, cHeight);

    for (let i1 = 0; i1 < planets.length; i1++) {
        for (let i2 = 0; i2 < planets.length; i2++) {
            if(i1 !== i2) {
                planets[i1] = addGravity(planets[i1], planets[i2])
                if(checkCollision(planets[i1], planets[i2])) mergePlanets(i1, i2)
            }
        }

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


        ctx.strokeStyle = 'rgba(150,150,150,255)';
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(fakeBall.x, fakeBall.y);
        ctx.lineTo(fakeBall.mx, fakeBall.my);
        ctx.stroke();
        ctx.closePath();
    }

    updateObjects()
    //console.log(planet.x,planet.y)

    window.requestAnimationFrame(renderObjects);
}

function updateObjects() {
    Array.prototype.forEach.call(planets, function (planet) {
        if(planet.planet) {
            planet.x += planet.vx;
            planet.y += planet.vy;

            //if(planet.y > 1000) planet.y = 0
            //if(planet.y < 0) planet.y = 1000
            //if(planet.x > 1000) planet.x = 0
            //if(planet.x < 0) planet.x = 1000

            if(planet.y > cHeight) planet.vy *= -1
            if(planet.y < 0) planet.vy *= -1
            if(planet.x > cWidth) planet.vx *= -1
            if(planet.x < 0) planet.vx *= -1
        }
    })
}

function mergePlanets(i1,i2) {
    let newPlanets = [];
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

    for(let i = 0; i < planets.length; i++) {
        if(i !== index) newPlanets.push(planets[i])
    }

    planets = newPlanets;
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

canvas.addEventListener("mousemove", function (e) {
    fakeBall.mx = e.offsetX;
    fakeBall.my = e.offsetY;
})

canvas.addEventListener("mousedown", function (e) {
    fakeBall.x = e.offsetX;
    fakeBall.y = e.offsetY;
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
        planet: planet
    }
}

window.requestAnimationFrame(renderObjects);