import { exception } from 'console';
import { Tokenizer } from 'tokenizers';
import { CLIPInput } from './CLIPModel';
import { ICollator } from './ICollator';

export class Collator implements ICollator {
    collate(
        sentences: string[], 
        tokenizer: Tokenizer, 
        nContextSentences: number
    ): CLIPInput[] {

        throw Error('Not Implemented');
    }

}