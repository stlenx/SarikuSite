const canvas = document.getElementById('canvas');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

const cHeight = canvas.height;
const cWidth = canvas.width;

ctx = canvas.getContext('2d');

let fakeBall = {
    x: 500,
    y: 500,
    mass: 20000,
    pressed: false,
    mx: -200,
    my: -200
}

let planets = []

function renderObjects() {
    ctx.fillStyle = 'rgba(255, 255, 255, .05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, cWidth, cHeight);

    for (let i1 = 0; i1 < planets.length; i1++) {
        for (let i2 = 0; i2 < planets.length; i2++) {
            if(i1 !== i2) {
                planets[i1] = addGravity(planets[i1], planets[i2])
                if(checkCollision(planets[i1], planets[i2])) mergePlanets(i1, i2)
            }
        }

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(planets[i1].x, planets[i1].y, getRadius(planets[i1]), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }

    if(fakeBall.pressed) {
        ctx.fillStyle = 'red';
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
    })
}

function mergePlanets(i1,i2) {
    let newPlanets = [];
    let index;
    if(planets[i1].mass > planets[i2].mass) {
        planets[i1].mass += planets[i2].mass;
        index = i2;
    } else {
        planets[i2].mass += planets[i1].mass;
        index = i1;
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
    planets.push(createPlanet(fakeBall.x, fakeBall.y, vector.x / 10,vector.y / 10, fakeBall.mass))

    fakeBall.pressed = false;
    fakeBall.mass = 20000;
});

function scrollMass(e) {
    let y = e.deltaY;
    if(fakeBall.pressed) {
        if (y > 0) {
            fakeBall.mass -= 3000;
        } else {
            fakeBall.mass += 3000;
        }
        console.log(fakeBall.mass)
    }
}

function createPlanet(x,y,vx,vy,mass) {
    return {
        x: x,
        y: y,
        mass: mass,
        vx: vx,
        vy: vy
    }
}

window.requestAnimationFrame(renderObjects);