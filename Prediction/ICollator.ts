import { Tokenizer } from "./Tokenizer.js";
import { CLIPInput } from "./CLIPModel";

export interface ICollator {
    collate: (sentences: string[], nContext: number) => Promise<CLIPInput[]>;
}