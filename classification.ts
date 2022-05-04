<<<<<<< HEAD
import { Tensor, InferenceSession } from 'onnxruntime-node';
import { Tokenizer } from './Prediction/Tokenizer';
=======
// const fs = require('fs');
// const util = require('util');
// const ort = require('onnxruntime-node');

import util from 'util';
import ort, { Tensor } from 'onnxruntime-node';
import { Collator } from './Prediction/Collator';
// import { Tokenizer, InputSequenc } from 'tokenizers/bindings/tokenizer';
import { Tokenizer } from './Prediction/Tokenizer.js';
import { CLIPModel } from './Prediction/CLIPModel';
// let temp = require('./popup');
// let { Collator } = require('./modules/Collator.ts');

// let { Tokenizer } = require("tokenizers/bindings/tokenizer");

// const InferenceSession = ort.InferenceSession;
>>>>>>> finish implement collator, add corrected typing to CLIPModel

/**
 * Sandbox for testing classes and functions.
 * Use `ts-node.cmd .\classification.ts` to run
 */
async function main() {
<<<<<<< HEAD
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
=======
    try {

        let t = new Tensor(new Int32Array([1,2,3,4,5,6]), [2,3,1]);
        console.log(t);
        console.log(t.dims)
        console.log(t.data.slice(0, t.dims[0]));
        throw Error('stop')
        
        let split_sentence_input = [
            "I have discussed with the patient in detail about the diagnosis of breast cancer and the surgical options, and medical oncologist has discussed with her issues about adjuvant or neoadjuvant chemotherapy.",
            "We have decided to recommend to the patient breast conservation surgery with left breast lumpectomy with preoperative sentinel lymph node injection and mapping and left axillary dissection.",
            "The possibility of further surgery requiring wider lumpectomy or even completion mastectomy was explained to the patient.",
            "The procedure and risks of the surgery were explained to include, but not limited to extra bleeding, infection, unsightly scar formation, the possibility of local recurrence, the possibility of left upper extremity lymphedema was explained.",
            "Local numbness, paresthesias or chronic pain was explained.",
            "The patient was given an educational brochure and several brochures about the diagnosis and treatment of breast cancers.",
            "She was certainly encouraged to obtain further surgical medical opinions prior to proceeding.",
            "I believe the patient has given full informed consent and desires to proceed with the above."
        ];
        // console.log(split_sentence_input);

        const col = new Collator();
        let tokenizer = Tokenizer.fromFile('./tokenizer.json');

        // let t = Tokenizer.fromString("");
        // let tokenizer = Tokenizer.fromFile("tokenizer.json");

        // let tokenizer = Tokenizer.fromFile('./tokenizer.json');

        let inputs = await col.collate(
            split_sentence_input,
            tokenizer,
            2
        );

        console.log(inputs[0]);

        let clip = new CLIPModel(
            './bert.onnx',
            './classifier.onnx',
        );

        let out = await clip.forward(inputs[0])
        console.log(out);

        // var test_sent = "This is a test sentence for tokenization";
        // let output = await tokenizer.encode(test_sent);
        // console.log(output.getIds());
        // console.log(output.getAttentionMask());
        // console.log(output.getTypeIds());


        // const encode = tokenizer.encode.bind(tokenizer);
        // console.log('encode');
        // let unencoded : InputSequence = test_sent;
        // encode(test_sent, undefined, undefined);

        // console.log('encoded');
    //     // console.log(output.getTokens());
        // console.log(output.getIds());
    //     // console.log(Object.prototype.toString.call(output.getIds));
    //     // // console.log(tokenizer.encode(test_sent));

    //     // var input = new ort.Tensor(
    //     //     type = 'float32',
    //     //     data = randomTensor(768),
    //     // );
    //     // // console.log(input);

    //     // bert_feeds = {
    //     //     input_ids: output.getIds()
    //     // };

    //     // const options = {
    //     //     logSeverityLevel: 0,
    //     // };

    //     // bert_session = await InferenceSession.create('./bert.onnx');

    //     // const bert_result = await bert_session.run(bert_feeds);

    //     // feeds = {
    //     //     input : input
    //     // };
>>>>>>> finish implement collator, add corrected typing to CLIPModel
        
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
