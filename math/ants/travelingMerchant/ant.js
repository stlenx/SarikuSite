class Ant {
    constructor(destinations, pheromone) {
        this.solution = new Solution();
        this.current = destinations[0];
        destinations.splice(0,1)
        this.destinations = destinations;
        this.solution.Path = [this.current];
        this.pheromone = pheromone;
    }

    CalculateNext() {

        let weights = [];
        for(let i = 0; i < this.destinations.length; i++) {
            weights.push(this.GetDesirability(this.destinations[i]))
        }
        let path = WeightedRandom(weights);

        this.solution.AddDestination = this.destinations[path];
        this.current = this.destinations[path];
        this.destinations.splice(path, 1)

        //this.solution.CalcDst();
    }

    GetDesirability(destination) {
        let dst = getDistanceBetween(this.current, destination)
        let pheromoneStrength = 1;
        if(this.pheromone !== []) {
            if(this.pheromone.includes(destination)) {
                pheromoneStrength = 2;
            }
        }
        return Math.pow(1 / dst, 2.3) * Math.pow(pheromoneStrength, 3.5);
    }

    Draw() {
        this.solution.Draw()
    }
}