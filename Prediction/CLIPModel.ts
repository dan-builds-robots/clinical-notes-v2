import { InferenceSession, Tensor, TypedTensor } from "onnxruntime-node";

// Default ONNX setting is to use "int64"
/**
 * Default ONNX setting is to use "int64" however this is
 * wasteful and all of our inputs start out as "int32". In 
 * future update will export model with "int32" instead and
 * update these types.
 */
export type CLIPInput = {
    input_ids: TypedTensor<"int64">,
    attention_mask: TypedTensor<"int64">,
    token_type_ids: TypedTensor<"int64">,
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
    bertSession: Promise<InferenceSession>;
    classifierSession: Promise<InferenceSession>;


    constructor(
        bertPath: string,
        classifierPath: string,
        // thresholdPath: string,
    ) {
        this.bertSession = InferenceSession.create(bertPath);
        this.classifierSession = InferenceSession.create(classifierPath);
    }

    async forward(input: CLIPInput, options = {}): Promise<CLIPMultiResponse> {
        const bertResult = await (await this.bertSession).run(input, options);
        console.log(bertResult);
        const classifierResult = await (await this.classifierSession).run(bertResult, options);
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