const canvas = document.getElementById('canvas');
canvas.setAttribute('width', 300);
canvas.setAttribute('height', 300);
ctx = canvas.getContext('2d');

let fluid = new Fluid(0.2, 0, 0.0000001);

function draw() {
  //stroke(51);
  //strokeWeight(2);

  let cx = parseInt((0.5 * 300) / SCALE)
  let cy = parseInt((0.5 * 300) / SCALE)
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      fluid.addDensity(cx + i, cy + j, getRandom(50, 150));
    }
  }

  for (let i = 0; i < 2; i++) {
    let angle = 1.3;
    let v = new Vector2(Math.cos(angle), Math.sin(angle))
    v.x *= 0.2;
    v.y *= 0.2;

    fluid.addVelocity(cx, cy, v.x, v.y);
  }

  fluid.step();
  fluid.renderD();

  window.requestAnimationFrame(draw)
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

window.requestAnimationFrame(draw)
