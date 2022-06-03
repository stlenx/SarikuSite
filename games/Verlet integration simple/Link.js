class Link {
    constructor(object1, object2, dist) {
        this.object_1 = object1;
        this.object_2 = object2;
        this.target_dist = dist;
    }

    apply(solver) {
        let obj1 = solver.objects[this.object_1];
        let obj2 = solver.objects[this.object_2];

        let axis = new Vector2(obj1.position_current_x - obj2.position_current_x, obj1.position_current_y - obj2.position_current_y);
        let dist = axis.Length();

        let n = new Vector2(axis.x / dist, axis.y / dist);
        let delta = this.target_dist - dist;

        if(!obj1.fixed) {
            obj1.position_current_x += 0.5 * delta * n.x;
            obj1.position_current_y += 0.5 * delta * n.y;
        }

        if(!obj2.fixed) {
            obj2.position_current_x -= 0.5 * delta * n.x;
            obj2.position_current_y -= 0.5 * delta * n.y;
        }
    }
}