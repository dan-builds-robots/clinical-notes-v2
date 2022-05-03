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

        var output: CLIPInput[] = []

        // Tokenize inputs
        let encoded_sents = await Promise.all(sentences.map(async sent => tokenizer.encode(sent)));
        console.log(encoded_sents);
        
        // throw Error('stop');

        // iterate through sentences
        for (let i = 0; i < sentences.length; i++) {
            // get context

            var pre_context = sentences.slice(Math.max(i-nContextSentences, 0), i);
            var cur_sent = sentences[i];
            var post_context = sentences.slice(i+1, Math.min(i+nContextSentences, sentences.length)+1);


            // iterate until context is under 512
            var input_length = pre_context.reduce((a, b) => a + b.length, 0) 
                + cur_sent.length
                + post_context.reduce((a,b) => a + b.length, 0);
            
            while (input_length > 512) {

            }

            var pre_context_len = pre_context.reduce((a, b) => a + b.length, 0)  
            var post_context_len = post_context.reduce((a, b) => a + b.length, 0) 

            // don't worry about sentence exceeding token limit until we get there

            // tokenize input
            var input_ids = pre_context.reduce((a:string[],b) => a.concat(b), [])
                .concat(cur_sent)
                .concat(post_context.reduce((a:string[], b) => a.concat(b), []));

            // generate token_type_ids
            var token_type_ids = this.ones(pre_context_len, 0)
                .concat(this.ones(cur_sent.length, 1))
                .concat(this.ones(post_context_len, 0));
                // length = 
            // )

            // if (i > 3) {
            // }
            output.push({
                input_ids: null,
                attention_mask: null,
                token_type_ids: token_type_ids,
            });

        }
        // return clip inputs

        throw Error('Not Implemented');
    }

    ones(length: number, value: number): number[] {
        return Array.from({length}, () => value);
    }

}
