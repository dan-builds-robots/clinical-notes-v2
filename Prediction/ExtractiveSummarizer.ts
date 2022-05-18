import { Tokenizer } from './Tokenizer.js';
import { Collator } from './Collator';
import { ICollator } from './ICollator';
import { 
    IExtractiveSummarizer,
    Span 
} from './IExtractiveSummarizer';
import { CLIPModel } from './CLIPModel.js';
import { spawnSync } from 'child_process';


export class CLIPSummarizer implements IExtractiveSummarizer {
    collator: ICollator;
    model: CLIPModel;

    constructor(
        tokenizerPath: string,
        bertPath: string,
        classifierPath: string,
    ) {
        let tokenizer = Tokenizer.fromFile(tokenizerPath);
        this.collator = new Collator(tokenizer);
        this.model = new CLIPModel(bertPath, classifierPath);
    }
    
    async extract(
        document: string,
        nContextSentences: number = 2,
    ): Promise<Span[]> {
        // Separate into individual sentences
        let sentence_spans = this.splitDocument(document);
        let sentences = sentence_spans
            .map((span) => document.substring(span.start, span.end));

        // prepare inputs
        let model_inputs = await this.collator.collate(sentences, nContextSentences);

        // Query to Model
        let output: Promise<Span[]> = Promise.all(sentence_spans
            .map(async (span, idx) => ({
                start: span.start,
                end: span.end,
                label: await this.model.forward(model_inputs[idx])
            }))
        );
        return output;
    }

    /**
     * Separate text document into individual sentences in the form of sentence
     * spans.
     * @param document text document.
     * @returns spans indicating sentence boundaries.
     */
    private splitDocument(document: string): Span[] {
        // TODO: Daniel
        throw Error("Not Implemented");
    }
}