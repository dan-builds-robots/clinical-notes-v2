import { Collator } from './Prediction/Collator';
import { Tokenizer } from './Prediction/Tokenizer.js';
import { CLIPModel } from './Prediction/CLIPModel';

/**
 * Sandbox for testing classes and functions.
 * Use `ts-node.cmd .\classification.ts` to run
 */
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

        let tokenizer = Tokenizer.fromFile('./tokenizer.json');
        const col = new Collator(tokenizer);

        let inputs = await col.collate(
            split_sentence_input,
            2
        );

        let model = new CLIPModel(
            './bert.onnx',
            './classifier.onnx',
        )

        let out = await model.forward(inputs[0])
        console.log(out)

    } catch(e) {
        console.error(`inference failed: ${e}`);
    }
}

main();
