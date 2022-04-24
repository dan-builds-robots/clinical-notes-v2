const fs = require('fs');
const util = require('util');
const ort = require('onnxruntime-node');

let { Tokenizer } = require("tokenizers/bindings/tokenizer")

const InferenceSession = ort.InferenceSession;

async function main() {
    try {

        var test_sent = "This is a test sentence for tokenization";

        let tokenizer = Tokenizer.fromFile('./tokenizer.json');
        let encode = util.promisify(tokenizer.encode.bind(tokenizer));
        // console.log('encode');
        var output = await encode(test_sent);

        console.log(output.getTokens());
        console.log(output.getIds());
        console.log(Object.prototype.toString.call(output.getIds));
        // console.log(tokenizer.encode(test_sent));

        var input = new ort.Tensor(
            type = 'float32',
            data = randomTensor(768),
        );
        // console.log(input);

        bert_feeds = {
            input_ids: output.getIds()
        };

        const options = {
            logSeverityLevel: 0,
        };

        bert_session = await InferenceSession.create('./bert.onnx');

        const bert_result = await bert_session.run(bert_feeds);

        feeds = {
            input : input
        };
        
        session = await InferenceSession.create('./classifier.onnx');
        
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

