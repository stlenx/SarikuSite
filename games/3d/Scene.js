class Scene {
    constructor(camera) {
        this.camera = camera;
        this.objects = [];
    }

    AddObject(object) {
        this.objects.push(object)
    }

    Draw() {
        this.objects.forEach((o) => {

        })
    }
}