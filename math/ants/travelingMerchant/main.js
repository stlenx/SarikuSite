let canvas = document.getElementById("canvas");
canvas.setAttribute("width", window.innerWidth)
canvas.setAttribute("height", window.innerHeight)
let ctx = canvas.getContext("2d");

let bestText = document.getElementById("bestText")
let bestSolution = new Solution()
let pheromoneSol = new Solution()
let destinations = [];
let running = true;
let antN = 10;
let destN = 20;

for(let i = 0; i < destN; i++) {
    destinations.push(new Destination(getRandom(0, canvas.width), getRandom(0, canvas.height)))
}
bestSolution.Path = destinations;

function BruteForce() {
    //First dumb test
    bestSolution.CalcDst()

    //Ok proper thing now?
    let copy = [];
    for(let i = 1; i < destinations.length; i++) {
        copy.push(destinations[i])
    }
    let randomShit = shuffle(copy);
    randomShit.unshift(destinations[0])
    let newSolution = new Solution()
    newSolution.Path = randomShit;
    newSolution.CalcDst();
    //console.log(randomShit)
    if(newSolution.distance < bestSolution.distance) {
        bestSolution = newSolution;
    }
}

function shuffle(array) {
    let copy = [], n = array.length, i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
}

function DrawDestinations() {
    ctx.strokeStyle = "blue"
    let circle = new Path2D()
    circle.arc(destinations[0].x, destinations[0].y, 10, 0, Math.PI*2);
    ctx.stroke(circle);
    ctx.strokeStyle = "white"
    for(let i = 1; i < destinations.length; i++) {
        let circle = new Path2D()
        circle.arc(destinations[i].x, destinations[i].y, 10, 0, Math.PI*2);
        ctx.stroke(circle);
    }
}

let ants = []
let pheromone = [];
function AddAnts() {
    ants = [];
    for(let i = 0; i < antN; i++) {
        let copy = [];
        for(let i = 0; i < destinations.length; i++) {
            copy.push(destinations[i])
        }
        ants.push(new Ant(copy, pheromone))
    }
}

function RunAnts() {
    for(let i = 0; i < destinations.length - 1; i++) {
        ants.forEach((a) => {
            a.CalculateNext()
        })
    }
}

function EvaluatePaths() {
    let best = Infinity;
    let index = 0;
    for(let i = 0; i < ants.length; i++) {
        ants[i].solution.CalcDst()
        if(ants[i].solution.distance < best) {
            best = ants[i].solution.distance
            index = i;
        }
    }
    pheromoneSol = ants[index].solution;
    pheromoneSol.CalcDst()

    //Try?
    pheromone = [];
    for(let i = 0; i < pheromoneSol.points.length - 1; i++) {
        pheromone.push(new Path(pheromoneSol.points[i], pheromoneSol.points[i+1]).Hash)
    }

    bestSolution.CalcDst()
    if(pheromoneSol.distance < bestSolution.distance) {
        bestSolution = pheromoneSol;
    }
}

function Hash(input) {
    let hash = 0;
    if (input.length === 0) {
        return hash;
    }
    for (let i = 0; i < input.length; i++) {
        let char = input.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function DrawAnts() {
    ants.forEach((a) => {
        a.Draw()
    })
}

function frame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height)

    bestSolution.Draw()

    //DrawAnts()

    DrawDestinations()

    //BruteForce()

    if(running) RunStep()

    bestText.innerHTML = `Best Solution: ${bestSolution.distance}`

    window.requestAnimationFrame(frame)
}

function RunStep() {
    AddAnts()
    RunAnts()
    EvaluatePaths()
}

function Reset() {
    bestSolution = new Solution()
    pheromoneSol = new Solution()
    destinations = [];
    for(let i = 0; i < destN; i++) {
        destinations.push(new Destination(getRandom(0, canvas.width), getRandom(0, canvas.height)))
    }
    bestSolution.Path = destinations;
}

window.requestAnimationFrame(frame)