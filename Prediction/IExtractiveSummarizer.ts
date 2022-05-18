import { CLIPLabel } from "./CLIPModel";

export type Span = {
    start: number,
    end: number
    label?: CLIPLabel[]
}

export interface IExtractiveSummarizer {
    extract: (document: string, nContextSentences: number) => Promise<Span[]>;
}