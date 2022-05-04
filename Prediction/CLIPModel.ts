import { InferenceSession, Tensor, TypedTensor } from "onnxruntime-node";

export type CLIPInput = {
    input_ids: TypedTensor<"int32">,
    attention_mask: TypedTensor<"int32">,
    token_type_ids: TypedTensor<"int32">,
};

export enum CLIPLabel {
    ReasonForVisit = 0,
    NatureOfDisease = 1,
    Prognosis = 2,
    TherapyAndRationale = 3,
    ActionItems = 4,
}

export class CLIPModel {
    bertSession: Promise<InferenceSession>;
    classifierSession: Promise<InferenceSession>;


    constructor(
        bertPath: string,
        classifierPath: string,
    ) {
        this.bertSession = InferenceSession.create(bertPath);
        this.classifierSession = InferenceSession.create(classifierPath);
    }

    async forward(input: CLIPInput, options = {}): Promise<CLIPLabel[]> {
        const bertResult = await (await this.bertSession).run(input, options);
        const classifierResult = await (await this.classifierSession).run(bertResult, options);
        const predictions = <TypedTensor<'int32'>> classifierResult['5'];

        return Array.from(predictions.data).map((a) => a as CLIPLabel);
    }
}