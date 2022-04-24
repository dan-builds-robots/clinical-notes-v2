const fs = require('fs');
const util = require('util');
const ort = require('onnxruntime-node');

const InferenceSession = ort.InferenceSession;

async function main() {
    try {

        var input = new ort.Tensor(
            type = 'float32',
            data = randomTensor(768),
        );
        // console.log(input);

        feeds = {
            input : input
        };

        session = await InferenceSession.create('./classifier.onnx');
        
        const options = {
            logSeverityLevel: 0,
        };
        const result = await session.run(feeds, options);
        console.log(result);

        console.log('success');

    } catch(e) {
        console.error(`inference failed: ${e}`);
    }
}

function randomTensor(size) {
        return Array.from({length: size}, () => Math.random());
}

main();

