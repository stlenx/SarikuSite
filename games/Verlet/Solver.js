class Solver {
    constructor(objects = []) {
        this.gravity = new Vector2(0, 0.001);
        this.objects = objects;
        this.links = [];
        this.generators = [];
        this.subSteps = 3;
    }

    update(dt) {
        let sub_dt = dt / this.subSteps;

        for(let i = 0; i < this.subSteps; i++) {
            this.applyGravity();
            this.applyConstraint();
            this.executeGenerators(dt);
            this.applyLinks();
            this.solveCollisions();
            this.updatePositions(sub_dt);
        }
    }

    executeGenerators(dt) {
        this.generators.forEach((generator) => {
            generator.update(dt, this);
        })
    }

    applyLinks() {
        this.links.forEach((link) => {
            link.apply(this);
        })
    }

    updatePositions(dt) {
        this.objects.forEach((obj) => {
            obj.updatePosition(dt);
        })
    }

    applyGravity() {
        this.objects.forEach((obj) => {
            obj.accelerate(this.gravity);
        })
    }

    applyConstraint() {
        let position = new Vector2(canvas.width / 2, canvas.height / 2);
        let radius = canvas.width / 2;

        this.objects.forEach((obj) => {
            let to_obj = new Vector2(obj.position_current_x - position.x, obj.position_current_y - position.y);
            let dist = to_obj.Length();

            let rDifference = radius - obj.radius;
            if(dist > rDifference) {
                let n = new Vector2(to_obj.x / dist, to_obj.y / dist);
                obj.position_current_x = position.x + n.x * rDifference;
                obj.position_current_y = position.y + n.y * rDifference;
            }
        })
    }

    solveCollisions() {
        for(let i = 0; i < this.objects.length; i++) {
            let object_1 = this.objects[i];
            for(let k = i+1; k < this.objects.length; k++) {
                let object_2 = this.objects[k];

                let collision_axis = new Vector2(object_1.position_current_x - object_2.position_current_x, object_1.position_current_y - object_2.position_current_y);
                let dist = collision_axis.Length();

                if(dist < object_1.radius + object_2.radius) {
                    let n = new Vector2(collision_axis.x / dist, collision_axis.y / dist);
                    let delta = (object_1.radius + object_2.radius) - dist;

                    let offsetX = 0.5 * delta * n.x;
                    let offsetY = 0.5 * delta * n.y;

                    if(!object_1.fixed) {
                        object_1.position_current_x += offsetX;
                        object_1.position_current_y += offsetY;
                    }

                    if(!object_2.fixed) {
                        object_2.position_current_x -= offsetX;
                        object_2.position_current_y -= offsetY;
                    }
                }
            }
        }
    }

    draw() {
        ctx.fillStyle = "rgb(0,0,0)";
        FillCircle(new Vector2(canvas.width / 2, canvas.height / 2), canvas.width / 2);

        this.drawBalls();
    }

    drawBalls() {
        this.objects.forEach((obj) => {
            obj.draw();
        })
    }
}