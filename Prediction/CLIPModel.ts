import { InferenceSession, Tensor, TypedTensor } from "onnxruntime-node";

export type CLIPInput = {
    input_ids: TypedTensor<"int64">,
    attention_mask: TypedTensor<"int64">,
    token_type_ids: TypedTensor<"int64">,
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
        let classifier_input = {
            'input': bertResult.pooler_output.reshape([768])
        };
        const classifierResult = await (await this.classifierSession).run(classifier_input, options);
        const predictions = <TypedTensor<'int32'>> classifierResult['3'];

        return this.labelFromPrediction(predictions);
    }

    labelFromPrediction(predictions: TypedTensor<'int32'>): CLIPLabel[] {
        let labels = predictions.data.reduce(
            (out: number[], val: number, idx: number) => val == 1 ? out.concat(idx) : out,
            []
        );

        return <CLIPLabel[]> labels;
    }
}
