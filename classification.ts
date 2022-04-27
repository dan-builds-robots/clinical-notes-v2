// const fs = require('fs');
// const util = require('util');
// const ort = require('onnxruntime-node');

import util from 'util';
import { Collator } from './Prediction/Collator';
// import { Tokenizer, InputSequenc } from 'tokenizers/bindings/tokenizer';
import { Tokenizer } from './Prediction/Tokenizer.js';
// let temp = require('./popup');
// let { Collator } = require('./modules/Collator.ts');

// let { Tokenizer } = require("tokenizers/bindings/tokenizer");

// const InferenceSession = ort.InferenceSession;

async function main() {
    try {

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

        col.collate(
            split_sentence_input,
            tokenizer,
            2
        );
        // var test_sent = "This is a test sentence for tokenization";
        // let output = await tokenizer.encode(test_sent);
        // console.log(output.getIds());


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
        
    //     // session = await InferenceSession.create('./classifier.onnx');
        
    //     // const result = await session.run(feeds, options);
    //     // console.log(result);

    //     console.log('success');

    } catch(e) {
        console.error(`inference failed: ${e}`);
    }
    // console.log("this is a test");
}

// function randomTensor(size) {
//         return Array.from({length: size}, () => Math.random());
// }

main();

