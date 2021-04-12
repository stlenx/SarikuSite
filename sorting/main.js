const canvas = document.getElementById('canvas');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
ctx = canvas.getContext('2d');
let height = canvas.height;
let width = canvas.width;

let numbers = new Array(width);

for(let i = 0; i < numbers.length; i++) {
    numbers[i] = getRandom(1, height)
}

let start = 0;
let end = numbers.length;
let arrays = [];
let splitted = false;

function Draw() {
    ctx.clearRect(0, 0, width, height);

    //BubbleSort()
    //CocktailSort()
    numbers = MergeSort(numbers)
    console.log(numbers)

    for (let i = 0; i < numbers.length; i++) {
        ctx.strokeStyle = 'rgba(0,0,0,255)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(i, height);
        ctx.lineTo(i, height - numbers[i]);
        ctx.stroke();

        ctx.closePath();
    }

    window.requestAnimationFrame(Draw)
}

function MergeSort(numbers) {
    if(!IsSorted(numbers)) {
        //if(!splitted) {
        //    numbers = Split(numbers)
        //    arrays = arrays.filter(function (el) {return el.length !== 0;});
        //    splitted = true;
        //    return numbers
        //} else {
        //    if(arrays.length > 2) {
        //        let output = [];
        //        for (let i = 0; i < arrays.length - 1; i+=2) {
        //            let result = Merge(arrays[i], arrays[i + 1])
        //            output.concat(result)
        //        }
        //        console.log(output)
        //        return output;
        //    }
        //    return numbers;
        //}
        numbers = Split(numbers)
        arrays = arrays.filter(function (el) {return el.length !== 0;});
        let output = [];
        for (let i = 0; i < arrays.length - 1; i+=2) {
            let result = Merge(arrays[i], arrays[i + 1])
            output = result;
        }
        return output;
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
        start++;
    }
}

function BubbleSort() {
    if(!IsSorted(numbers)) {
        //let end = numbers.length
        for(let i = 0; i < numbers.length; i++) {
            if(numbers[i] > numbers[i + 1]) {
                let bigNumber = numbers[i];
                numbers[i] = numbers[i + 1];
                numbers[i + 1] = bigNumber;
            }
        }
    }
}

function IsSorted(numbers) {
    for(let i = 0; i < numbers.length; i++) {
        if(numbers[i] > numbers[i + 1]) return false;
    }
    return true;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(
        function() {
            oscillator.stop();
            playMelody();
        }, duration);
}

window.requestAnimationFrame(Draw)