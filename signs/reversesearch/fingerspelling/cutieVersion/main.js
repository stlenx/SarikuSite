const video = document.getElementsByClassName("input_video")[0];
const canvas = document.getElementsByClassName('output_canvas')[0];
const ctx = canvas.getContext('2d');

let perspT = PerspT([0, 0, 500, 0, 0, 500, 500, 500], [0, 0, 500, 0, 0, 500, 500, 500]);

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
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);


    DrawHand(results.multiHandLandmarks, '#61ff61', '#ff4c4c');


    let handedness = 1;

    if(results.multiHandedness[0] !== undefined) {
        handedness = results.multiHandedness[0].label === "Right" ? 1 : -1;
    }

    DrawHandMe(aHand, results.multiHandLandmarks[0], '#4444ff', '#4545ff', handedness);

    GuessGesture(results.multiHandLandmarks[0], 50, handedness);

    ctx.restore();

    //console.log(ConvertToLocal(results.multiHandLandmarks[0]));

    video.requestVideoFrameCallback(frame);
}

function ConvertToLocal(hand) {
    let origin = hand[0];

    let result = [];

    for(let i = 1; i < hand.length; i++) {
        let landmark = hand[i];

        result[i] = {
            x: landmark.x - origin.x,
            y: landmark.y - origin.y
        }
    }

    return result;
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

function CheckHand(hand, target, variety, handedness) {
    if(hand === undefined || target === undefined) return false;


    let localHand = ConvertToLocal(hand);

    let source = [0,0,   target[5].x,target[5].y,   target[9].x,target[9].y,   target[17].x,target[17].y];
    let dest = [0,0,   localHand[5].x,localHand[5].y,   localHand[9].x,localHand[9].y,   localHand[17].x,localHand[17].y];
    let matrix = PerspT(source, dest);

    let scaleFactor = GetScaleFactor(hand, target);

    variety *= scaleFactor;

    for(let i = 1; i < hand.length; i++) {
        let landmarkX = hand[i].x * canvas.width;
        let landmarkY = hand[i].y * canvas.height;

        let transformed = matrix.transform(target[i].x, target[i].y);
        let targetLandmarkX = (hand[0].x + transformed[0]) * canvas.width;
        let targetLandmarkY = (hand[0].y + transformed[1]) * canvas.height;

        if(!(landmarkX > targetLandmarkX - variety && landmarkX < targetLandmarkX + variety)) {
            return false;
        }
        if(!(landmarkY > targetLandmarkY - variety && landmarkY < targetLandmarkY + variety)) {
            return false;
        }

        ctx.fillStyle = "rgba(0,0,0,0.02)";
        ctx.fillRect(targetLandmarkX - variety, targetLandmarkY - variety, variety*2, variety*2);
    }

    return true;
}

function DrawHandMe(hand, actualHand, connectorColor, landmarkColor, handedness) {
    if(actualHand === undefined) return;

    let origin = actualHand[0];

    //x0, y0, x5, y5, x9, y9, x17, y17
    let localHand = ConvertToLocal(actualHand);
    let source = [0,0,   hand[5].x,hand[5].y,   hand[9].x,hand[9].y,   hand[17].x,hand[17].y];
    let dest = [0,0,   localHand[5].x,localHand[5].y,   localHand[9].x,localHand[9].y,   localHand[17].x,localHand[17].y];

    let matrix = PerspT(source, dest);

    ctx.fillStyle = landmarkColor;
    ctx.fillRect(canvas.width * origin.x, canvas.height * origin.y, 10, 10);

    for(let i = 1; i < hand.length; i++) {
        let landmark = hand[i];

        let dest = matrix.transform(landmark.x, landmark.y);

        let finalX = dest[0];
        let finalY = dest[1];

        ctx.fillStyle = landmarkColor;
        if(i === 9) {
            ctx.fillStyle = "yellow";
        }
        ctx.fillRect(canvas.width * (origin.x + finalX * handedness), canvas.height * (origin.y + finalY), 15, 15);
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