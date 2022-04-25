import { InferenceSession, Tensor } from "onnxruntime-node";

// No typing support for tokenizer library
export type CLIPInput = {
    input_ids,
    attention_mask,
    token_type_ids,
};

export type CLIPMultiResponse = {
    label: CLIPLabel[],
};

export enum CLIPLabel {
    ReasonForVisit,
    NatureOfDisease,
    Prognosis,
    TherapyAndRationale,
    ActionItems,
}

export class CLIPModel {
    bertSession: InferenceSession;
    classifierSession: InferenceSession;

    async init(
        bertPath: string,
        classifierPath: string,
        thresholdPath: string,
    ) {
        this.bertSession = await InferenceSession.create(bertPath);
        this.classifierSession = await InferenceSession.create(classifierPath);
    }

    async forward(input: CLIPInput, options = {}): Promise<CLIPMultiResponse> {
        const bertResult = await this.bertSession.run(input, options);
        const classifierResult = await this.classifierSession.run(bertResult, options);
        return this.getLabels(classifierResult['last_hidden_state']);
    }

    /**
     * Takes logits and coverts them to labels by comparing against thresholds
     * for each class.
     * @param logits output logits from CLIP classification layer.
     * @returns a list of labels.
     */
    private getLabels(logits: Tensor): CLIPMultiResponse {
        // TODO: Daniel 
        /**
         * You can look at this as a reference:
         * https://github.com/asappresearch/clip/blob/main/test_load.py#L37-L39
         * The challenge will be in figuring out how to perform these operations
         * in javascript.
         */
        
        throw Error("Not Implemented");
    }
}