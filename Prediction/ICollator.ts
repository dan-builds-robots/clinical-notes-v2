import { Tokenizer } from "./Tokenizer";
import { CLIPInput } from "./CLIPModel";

export interface ICollator {
    collate: (sentences: string[], tokenizer: Tokenizer, nContext: number) => Promise<CLIPInput[]>;
}