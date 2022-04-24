import { CLIPLabel } from "./CLIPModel";

export type ExtractiveSummarizerResponse = {
    spans: Span[]
}

export type Span = {
    start: number,
    end: number
    label: CLIPLabel[]
}

export interface IExtractiveSummarizer {
    extract: (document: string) => Promise<ExtractiveSummarizerResponse>;
}