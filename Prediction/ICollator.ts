import { Tokenizer } from "tokenizers";
import { CLIPInput } from "./CLIPModel";

export interface ICollator {
    collate: (sentences: string[], tokenizer: Tokenizer, nContext: number) => CLIPInput[];
}