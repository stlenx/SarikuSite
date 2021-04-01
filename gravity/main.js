const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

let sun = {
    x: 500,
    y: 500,
    mass: 500000,
    vx: 0,
    vy: 0
}

let planet = {
    x: 400,
    y: 500,
    mass: 1000,
    vx: 0,
    vy: -5
}

function renderObjects() {
    ctx.clearRect(0, 0, 1000, 1000);

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, 10, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, 5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    updateObjects()

    planet = addGravity(planet, sun)
    //sun = addGravity(sun, planet)

    //console.log(planet.x,planet.y)

    window.requestAnimationFrame(renderObjects);
}

function updateObjects() {
    planet.x += planet.vx;
    planet.y += planet.vy;
    sun.x += sun.vx;
    sun.y += sun.vy;
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
    return Math.sqrt( ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * b.y - a.y) )
}

window.requestAnimationFrame(renderObjects);

