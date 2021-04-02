const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

let planet = {
    x: 500,
    y: 500,
    mass: 500000,
    vx: 0,
    vy: 0.5
}

let planet2 = {
    x: 500,
    y: 700,
    mass: 500000,
    vx: 0,
    vy: 0.5
}

let sun = {
    x: 400,
    y: 500,
    mass: 1000,
    vx: 0,
    vy: -5
}

let planets = []

planets.push(planet);
//planets.push(planet2);
planets.push(sun);

function renderObjects() {
    ctx.clearRect(0, 0, 1000, 1000);
    Array.prototype.forEach.call(planets, function (planet) {
        Array.prototype.forEach.call(planets, function (planet2) {
            planet = addGravity(planet, planet2)
        })

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 5, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    })

    updateObjects()
    //console.log(planet.x,planet.y)

    window.requestAnimationFrame(renderObjects);
}

function updateObjects() {
    Array.prototype.forEach.call(planets, function (planet) {
        planet = addGravity(planet, planet2)
        planet.x += planet.vx;
        planet.y += planet.vy;

        if(planet.y > 1000) planet.y = 0
        if(planet.y < 0) planet.y = 1000
        if(planet.x > 1000) planet.x = 0
        if(planet.x < 0) planet.x = 1000
    })
}

function addGravity(a,b) {
    let force = getGravitationalForce(a, b)

    let direction = getVector(a, b)
    //direction.normalize()
    direction.x *= (force * 1000)
    direction.y *= (force * 1000)

    a.vx += direction.x
    a.vy += direction.y

    return a;
}

function getVector(a,b) {
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

window.requestAnimationFrame(renderObjects);