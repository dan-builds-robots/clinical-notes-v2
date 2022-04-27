import { Tokenizer } from './Tokenizer';
import { CLIPInput } from './CLIPModel';
import { ICollator } from './ICollator';

export class Collator implements ICollator {
    /**
     * 
     * @param sentences 
     * @param tokenizer 
     * @param nContextSentences number of context sentences to append to either end of the input.
     */
    async collate(
        sentences: string[], 
        tokenizer: Tokenizer, 
        nContextSentences: number
    ): Promise<CLIPInput[]> {

        let encoded_sents = await Promise.all(sentences.map(async sent => tokenizer.encode(sent)));
        console.log(encoded_sents);
        
        throw Error('stop');

        // iterate through sentences
        for (let i = 0; i < sentences.length; i++) {
            // get context

            var pre_context = sentences.slice(Math.max(i-nContextSentences, 0), i);
            var post_context = sentences.slice(i+1, Math.min(i+nContextSentences, sentences.length)+1);


            // iterate until context is under 512

            // don't worry about sentence exceeding token limit until we get there

            // tokenize input

            // generate token_type_ids

            if (i > 3) {
            }

        }
        // return clip inputs

        throw Error('Not Implemented');
    }

}
