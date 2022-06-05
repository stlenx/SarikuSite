class VerletObject {
    constructor(position, fixed = false, color = "rgb(255, 255, 255)", radius = 15, position_old = null) {
        this.acceleration = new Vector2(0, 0);

        this.position_current_y = position.y;
        this.position_current_x = position.x;

        if(position_old === null) {
            this.position_old_y = position.y;
            this.position_old_x = position.x;
        } else {
            this.position_old_y = position_old.y;
            this.position_old_x = position_old.x;
        }

        this.fixed = fixed;

        this.color = color;
        this.radius = radius;
    }

    draw() {
        ctx.fillStyle = this.color;
        FillCircle(new Vector2(this.position_current_x, this.position_current_y), this.radius);
    }

    updatePosition(dt) {
        if(this.fixed) return;

        //Calculate velocity based on position
        let velocity = new Vector2(this.position_current_x - this.position_old_x, this.position_current_y - this.position_old_y);

        //Save current position
        this.position_old_x = this.position_current_x;
        this.position_old_y = this.position_current_y;

        //Perform Verlet integration
        let dtSQ = dt * dt;
        this.position_current_x += velocity.x + this.acceleration.x * dtSQ;
        this.position_current_y += velocity.y + this.acceleration.y * dtSQ;

        //Reset acceleration
        this.acceleration = new Vector2(0, 0);
    }

    accelerate(acc) {
        this.acceleration.add(acc);
    }
}