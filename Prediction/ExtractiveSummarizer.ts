import { 
    IExtractiveSummarizer,
    ExtractiveSummarizerResponse, 
    Span 
} from './IExtractiveSummarizer';


export class CLIPSummarizer implements IExtractiveSummarizer {
    
    async extract(document: string): Promise<ExtractiveSummarizerResponse> {
        // Separate into individual sentences

        // Collate 

        // Query to Model
        throw Error("Not Implemented");
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