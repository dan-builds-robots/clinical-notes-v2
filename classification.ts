import { Tensor, InferenceSession } from 'onnxruntime-node';
import { Tokenizer } from './Prediction/Tokenizer';

/**
 * Sandbox for testing classes and functions.
 * Use `ts-node.cmd .\classification.ts` to run
 */
async function main() {
    try {            
        // Load Tokenizer
        let tokenizer = Tokenizer.fromFile('./tokenizer.json');

        var test_sent = "This is a test sentence for tokenization";
        console.log("text before encoding:");
        console.log(test_sent);

        // encode test sentence
        let output = await tokenizer.encode(test_sent);
        console.log('Text after encoding');
        console.log(output.getTokens());
        console.log(output.getIds());

        // Generate Random input
        let nums = randomTensor(768);
        var input = new Tensor('float32', nums);
        console.log("Input");
        console.log(input);

        const options: InferenceSession.RunOptions = {
            logSeverityLevel: 0,
        };

        let feeds = {
            input : input
        };
        
        // Create ONNX session
        let session = await InferenceSession.create('./classifier.onnx');
        
        // Run inference on random input
        const result = await session.run(feeds, options);
        console.log(result);

        console.log('success');

    } catch(e) {
        console.error(`inference failed: ${e}`);
    }
}

function randomTensor(size: number): number[] {
        return Array.from({length: size}, () => Math.random());
}

main();
