const video = document.getElementsByClassName("input_video")[0];
const canvas = document.getElementsByClassName('output_canvas')[0];
const ctx = canvas.getContext('2d');

let aHand = [
    {
        "x": 0.8389694094657898,
        "y": 0.7146481275558472,
        "z": -4.6209930815166445e-7
    },
    {
        "x": -0.04832834005355835,
        "y": -0.049259960651397705,
        "z": -0.019612202420830727
    },
    {
        "x": -0.0866747498512268,
        "y": -0.12954413890838623,
        "z": -0.03012305684387684
    },
    {
        "x": -0.10363245010375977,
        "y": -0.2002573013305664,
        "z": -0.04115743562579155
    },
    {
        "x": -0.0984463095664978,
        "y": -0.26519933342933655,
        "z": -0.048567380756139755
    },
    {
        "x": -0.05281120538711548,
        "y": -0.23047858476638794,
        "z": -0.0041412487626075745
    },
    {
        "x": -0.06608355045318604,
        "y": -0.2549152970314026,
        "z": -0.03519726172089577
    },
    {
        "x": -0.05901819467544556,
        "y": -0.18956279754638672,
        "z": -0.05479603633284569
    },
    {
        "x": -0.05285537242889404,
        "y": -0.12815678119659424,
        "z": -0.06228652969002724
    },
    {
        "x": -0.016686737537384033,
        "y": -0.2330271303653717,
        "z": -0.005070848856121302
    },
    {
        "x": -0.030993163585662842,
        "y": -0.23888295888900757,
        "z": -0.03900961950421333
    },
    {
        "x": -0.028714537620544434,
        "y": -0.1552932858467102,
        "z": -0.05170855671167374
    },
    {
        "x": -0.027082204818725586,
        "y": -0.09188950061798096,
        "z": -0.05141323432326317
    },
    {
        "x": 0.01941436529159546,
        "y": -0.21969956159591675,
        "z": -0.010940414853394032
    },
    {
        "x": 0.004948556423187256,
        "y": -0.21611857414245605,
        "z": -0.04392274096608162
    },
    {
        "x": 0.0011923909187316895,
        "y": -0.13556766510009766,
        "z": -0.042311880737543106
    },
    {
        "x": -0.0009902119636535645,
        "y": -0.07680714130401611,
        "z": -0.03079424612224102
    },
    {
        "x": 0.05323845148086548,
        "y": -0.1962794065475464,
        "z": -0.01840405911207199
    },
    {
        "x": 0.04104411602020264,
        "y": -0.20633357763290405,
        "z": -0.03917070850729942
    },
    {
        "x": 0.031379103660583496,
        "y": -0.1525801420211792,
        "z": -0.034606609493494034
    },
    {
        "x": 0.0271761417388916,
        "y": -0.1115228533744812,
        "z": -0.02382728084921837
    }
];

function onResults(results) {
    document.getElementById("LoadingScreen").style.display = "none";

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);


    DrawHand(results.multiHandLandmarks, '#22c622', '#ce1c1c');

    let handedness = 1;
    if(results.multiHandedness[0] !== undefined) {
        handedness = results.multiHandedness[0].label === "Right" ? 1 : -1;
    }

    DrawHandMe(aHand, results.multiHandLandmarks[0], '#002aff');

    GuessBetter(results.multiHandLandmarks[0], handedness);

    ctx.restore();

    //if(results.multiHandLandmarks[0] !== undefined) {
    //    console.log(ConvertToLocal(results.multiHandLandmarks[0]));
    //}


    video.requestVideoFrameCallback(frame);
}

function ConvertToLocal(hand) {
    let origin = hand[0];

    for(let i = 1; i < hand.length; i++) {
        let landmark = hand[i];

        landmark.x -= origin.x
        landmark.y -= origin.y
    }

    return hand;
}

function GuessGesture(hand, variety, handedness) {
    let changed = false;

    for(const gesture of gestures) {
        if(CheckHand(hand, gesture.positions, variety, handedness)) {
            document.getElementById("results").innerText = gesture.name;
            aHand = gesture.positions;
            changed = true;
        }
    }

    if(!changed) {
        document.getElementById("results").innerText = "No idea";
    }
}

function GuessBetter(hand, handedness) {
    let guesses = [];

    let gesturesToUse = handedness === 1 ? gestures.left : gestures.right;

    for(const gesture of gesturesToUse) {
        let closeness = CheckHandBetter(hand, gesture.positions);
        guesses = insert(guesses, {
            value: closeness,
            name: gesture.name,
            positions: gesture.positions
        })
    }

    let final = guesses[0];
    document.getElementById("results").innerText = guesses[0].name;
    aHand = final.positions;
}

function insert(arr, item) {
    if(arr.length === 0) {
        arr.push(item);
        return arr;
    }

    for(let i = arr.length - 1; i > -1; i--) {

        if(item.value >= arr[i].value) {
            arr.splice(i+1, 0, item);
            return arr;
        }

        if(i === 0) {
            arr.unshift(item);
            return arr;
        }
    }
}

function CheckHandBetter(hand, target) {
    if(hand === undefined || target === undefined) return false;

    let scaleFactor = GetScaleFactor(hand, target);

    let angle = GetRotationFactor(hand, target);

    let total = 0;
    let sum = 0;
    for(let i = 1; i < hand.length; i++) {
        let landmarkX = hand[i].x * canvas.width;
        let landmarkY = hand[i].y * canvas.height;
        let landmarkZ = hand[i].z * canvas.width;

        let targetLandmarkX = (hand[0].x + RotateX(target[i].x * scaleFactor, target[i].y * scaleFactor, angle)) * canvas.width;
        let targetLandmarkY = (hand[0].y + RotateY(target[i].x * scaleFactor, target[i].y * scaleFactor, angle)) * canvas.height;
        let targetLandmarkZ = (hand[0].z + target[i].z * scaleFactor) * canvas.width;

        // ((2 - 1)2 + (1 - 1)2 + (2 - 0)2)1/2

        let distance = Math.pow(Math.pow(landmarkX - targetLandmarkX, 2) + Math.pow(landmarkY - targetLandmarkY, 2) + Math.pow(landmarkZ - targetLandmarkZ, 2), 0.5);
        total++;
        sum+=distance;

        //if(!(landmarkX > targetLandmarkX - variety && landmarkX < targetLandmarkX + variety)) {
        //    return false;
        //}
        //if(!(landmarkY > targetLandmarkY - variety && landmarkY < targetLandmarkY + variety)) {
        //    return false;
        //}
        //if(!(landmarkZ > targetLandmarkZ - variety && landmarkZ < targetLandmarkZ + variety)) {
        //    return false;
        //}
    }

    return sum / total;
}

function CheckHand(hand, target, variety, handedness) {
    if(hand === undefined || target === undefined) return false;

    let scaleFactor = GetScaleFactor(hand, target);

    let angle = GetRotationFactor(hand, target)  * handedness;

    variety *= scaleFactor;

    for(let i = 1; i < hand.length; i++) {
        let landmarkX = hand[i].x * canvas.width;
        let landmarkY = hand[i].y * canvas.height;
        let landmarkZ = hand[i].z * canvas.width;

        let targetLandmarkX = (hand[0].x + RotateX(target[i].x * scaleFactor, target[i].y * scaleFactor, angle) * handedness) * canvas.width;
        let targetLandmarkY = (hand[0].y + RotateY(target[i].x * scaleFactor, target[i].y * scaleFactor, angle)) * canvas.height;
        let targetLandmarkZ = (hand[0].z + target[i].z * scaleFactor) * canvas.width;

        if(!(landmarkX > targetLandmarkX - variety && landmarkX < targetLandmarkX + variety)) {
            return false;
        }
        if(!(landmarkY > targetLandmarkY - variety && landmarkY < targetLandmarkY + variety)) {
            return false;
        }
        if(!(landmarkZ > targetLandmarkZ - variety && landmarkZ < targetLandmarkZ + variety)) {
            return false;
        }

        //ctx.fillStyle = "rgba(0,0,0,0.02)";
        //ctx.fillRect(targetLandmarkX - variety, targetLandmarkY - variety, variety*2, variety*2);
    }

    return true;
}

function DrawHandMe(hand, actualHand, landmarkColor) {
    if(actualHand === undefined) return;

    //Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z)) 9

    let origin = actualHand[0];

    let angle = GetRotationFactor(actualHand, hand);

    let scaleFactor = GetScaleFactor(actualHand, hand);

    ctx.fillStyle = landmarkColor;
    ctx.fillRect(canvas.width * origin.x, canvas.height * origin.y, 10, 10);

    for(let i = 1; i < hand.length; i++) {
        let landmark = hand[i];

        //Scale
        let x = landmark.x * canvas.width;
        let y = landmark.y * canvas.height;
        x *= scaleFactor;
        y *= scaleFactor;

        //Rotate
        let finalX = RotateX(x, y, angle);
        let finalY = RotateY(x, y, angle);

        ctx.fillStyle = landmarkColor;
        ctx.fillRect(canvas.width * origin.x + finalX, canvas.height * origin.y + finalY, 15, 15);
    }
}

function RotateX(x, y, angle) {
    return x * Math.cos(angle) - y * Math.sin(angle);
}
function RotateY(x, y, angle) {
    return x * Math.sin(angle) + y * Math.cos(angle);
}


function GetRotationFactor(realHand, targetHand) {
    let realAngle = Math.atan2(realHand[9].x - realHand[0].x, realHand[9].y - realHand[0].y);
    let targetAngle = Math.atan2(targetHand[9].x, targetHand[9].y);
    return -realAngle + targetAngle;
}

function GetScaleFactor(realHand, targetHand) {
    let x = realHand[9].x - realHand[0].x;
    let y = realHand[9].y - realHand[0].y;
    let z = realHand[9].z - realHand[0].z;
    let handSize = Math.sqrt(x*x + y*y + z*z);

    x = targetHand[9].x;
    y = targetHand[9].y;
    z = targetHand[9].z;
    let targetSize = Math.sqrt(x*x + y*y + z*z);

    return (handSize / targetSize);
}


function DrawHand(hand, connectorColor, landmarkColor) {
    for (const landmarks of hand) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS,
            {color: connectorColor, lineWidth: 5});
        drawLandmarks(ctx, landmarks, {color: landmarkColor, lineWidth: 0.5});
    }
}


const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);


if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720} })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
}

function frame() {
    hands.send({image: video})
}

video.requestVideoFrameCallback(frame);