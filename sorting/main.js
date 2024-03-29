const canvas = document.getElementById('canvas');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

let numbers = new Array(width);

let clicked = false;

let start = 0;
let end = numbers.length;
let gap = numbers.length;
let algorithm = 0;
let volume = 0.8;
let arrays = [];
let splitted = false;

function Draw() {
    if(!clicked) return; // interact first with the page you gae
    ctx.clearRect(0, 0, width, height);

    switch (algorithm) {
        case 0:
            BubbleSort()
            break;
        case 1:
            CocktailSort()
            break;
        case 2:
            CombSort()
            break;
    }

    //if(audioCtx !== undefined) playNote(261, 20)
    //numbers = MergeSort(numbers)
    //console.log(numbers)

    for (let i = 0; i < numbers.length; i++) {
        ctx.strokeStyle = 'rgba(0,0,0,255)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(i, height);
        ctx.lineTo(i, height - numbers[i]);
        ctx.stroke();

        ctx.closePath();
    }
}

function UpdateInputs() {
    volume = document.getElementById("volume").value;
}

function frame() {
    UpdateInputs()
    Draw()
    window.requestAnimationFrame(frame)
}

function MergeSort() {
    if(!IsSorted(numbers)) {
        arrays = [];
        console.log(numbers)
        numbers = Split(numbers)
        console.log(numbers)
        arrays = arrays.filter(function (el) {return el.length !== 0;});
        console.log(arrays)
        let output = [];
        for (let i = 0; i < arrays.length; i++) {
            output.push(arrays[i][0])
        }
        numbers = output;
    }
}

function Split(array) {
    const half = array.length / 2

    // Base case or terminating case
    if(array.length < 2){
        arrays.push(array)
        return array
    }

    const left = array.splice(0, half)
    return Merge(Split(left),Split(array))
}

function Merge(list1, list2) {
    let output = [];
    if(list1.length && list2.length) {
        if(list1[0] > list2[0]) {
            output.push(list1.shift())
        } else {
            output.push(list2.shift())
        }
    }
    return [ ...output , ...list1, ...list2 ]
}

function CombSort() {
    if(!IsSorted(numbers)) {
        for(let i = 0; i < numbers.length - gap; i++) {
            if(numbers[i] > numbers[i + gap]) {
                let bigNumber = numbers[i];
                numbers[i] = numbers[i + gap];
                numbers[i + gap] = bigNumber;
            }
        }
        gap = gap < 1 ? 1 : Math.floor(gap / 1.3)

        let frequency = Remap(end, 0, numbers.length, 0, 1000)
        //new SoundPlayer(audio).play(frequency, volume, "sine").stop(0.1);
        end--;
    }
}

function CocktailSort() {
    if(!IsSorted(numbers)) {
        for (let i = 0; i < end-1; i++) //Sort forwards
        {
            if (numbers[i] > numbers[i + 1])
            {
                let bigNumber = numbers[i];
                numbers[i] = numbers[i + 1];
                numbers[i + 1] = bigNumber;
            }
        }
        let frequency = Remap(end, 0, numbers.length, 0, 1000)
        //new SoundPlayer(audio).play(frequency, volume, "sine").stop(0.1);
        end--;
        for (let i = end; i > start; i--) //Sort backwards
        {
            if(numbers[i] < numbers[i - 1])
            {
                let bigNumber = numbers[i - 1];
                numbers[i - 1] = numbers[i];
                numbers[i] = bigNumber;
            }
        }
        frequency = Remap(start, 0, numbers.length, 0, 1000)
        //new SoundPlayer(audio).play(frequency, volume, "sine").stop(0.1);
        start++;
    }
}

function BubbleSort() {
    if(!IsSorted(numbers)) {
        for(let i = 0; i < numbers.length; i++) {
            if(numbers[i] > numbers[i + 1]) {
                let bigNumber = numbers[i];
                numbers[i] = numbers[i + 1];
                numbers[i + 1] = bigNumber;
            }
        }

        let frequency = Remap(end, 0, numbers.length, 0, 1000)
        //new SoundPlayer(audio).play(frequency, volume, "sine").stop(0.1);
        end--;
    }
}

function IsSorted(numbers) {
    for(let i = 0; i < numbers.length; i++) {
        if(numbers[i] > numbers[i + 1]) return false;
    }
    return true;
}

function WhichSort(value) {
    gap = numbers.length;
    algorithm = parseInt(value);
    console.log(algorithm)
}

let audio

function run() {
    numbers = new Array(width);
    arrays = [];

    for(let i = 0; i < numbers.length; i++) {
        numbers[i] = getRandom(1, height)
    }

    start = 0;
    end = numbers.length;
    gap = numbers.length;

    //let AudioContext = window.AudioContext || window.webkitAudioContext;
//
    //audio = new AudioContext();

    clicked = true;
}

window.requestAnimationFrame(frame)