
function animate(){
    ctx.clearRect(0,0,innerWidth,innerHeight);

    connect();

    particleArray.forEach((particle) => {
        particle.Update()
        particle.Draw()
    })

    requestAnimationFrame(animate);
}
animate();