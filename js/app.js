import { setupCamera, videoHeight, videoWidth, drawCanvas, ctx, canvas} from "./camera.js"
import { drawKeypoints } from "./draw.js"

const k = 3
const machine = new kNear(k)
const input = document.getElementById("label")
const train = document.getElementById("train")
const classify = document.getElementById("classify")
const log = document.querySelector("#array")
let model
let data
let currentPosition

// training - todo: meerdere voorbeelden voor cats en dogs nodig!
train.addEventListener("click", learning);
classify.addEventListener("click", predict);

async function main(){
    model = await handpose.load()
    const video = await setupCamera()
    video.play()
    drawCanvas(video)
    predictLandmarks()
}

async function predictLandmarks() {
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height)
    // prediction!
    const predictions = await model.estimateHands(video)

    if (predictions.length > 0) {
        const result = predictions[0].landmarks
        drawKeypoints(ctx, result, predictions[0].annotations)
        logData(predictions)
        //console.log(result)
        currentPosition = arrayLoop(result)
    }
    // 60 keer per seconde is veel, gebruik setTimeout om minder vaak te predicten
    requestAnimationFrame(predictLandmarks)

    // setTimeout(()=>predictLandmarks(), 1000)
    
}

function arrayLoop(result){
    let positionArray = [];
 
    for (let landmark of result){
        positionArray.push(landmark[0])
        positionArray.push(landmark[1])
        positionArray.push(landmark[2])
    }

    //console.log(positionArray)
    return positionArray
 }

function logData(predictions) {
    data = 0;
    for (let i = 0; i < 4; i++) {
        data += predictions[0].landmarks[i][0] + ", " + predictions[0].landmarks[i][1] + ", " + predictions[0].landmarks[i][2] + ", "
    }
    log.innerText = data
}

function learning(){
    console.log(currentPosition)
    machine.learn(currentPosition, input.value)
    console.log(`I learned ${input.value}`)
}

// predicting
function predict(){
    let prediction = machine.classify(currentPosition)
    console.log(`I think it's a ${prediction}`)
}

main()
