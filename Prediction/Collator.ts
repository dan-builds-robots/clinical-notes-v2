import { Tokenizer } from './Tokenizer.js';
import { CLIPInput } from './CLIPModel';
import { ICollator } from './ICollator';
import { Tensor, TypedTensor } from "onnxruntime-node";

export class Collator implements ICollator {
    tokenizer: Tokenizer

    constructor(tokenizer: Tokenizer) {
        this.tokenizer = tokenizer;
    }

    /**
     * This implementation is based on https://github.com/asappresearch/clip/blob/main/sentclf/bert.py#L70-L188
     * Some of the inefficiencies of the original implementation are addressed here. In particular,
     * we tokenize once and then apply context after tokenization.
     * @param sentences List of sentences to tokenize and apply context to.
     * @param nContextSentences number of context sentences to append to either end of the input.
     */
    async collate(
        sentences: string[], 
        nContextSentences: number
    ): Promise<CLIPInput[]> {

        var output: CLIPInput[] = []

        let paddedSents = Array.from({length: nContextSentences}, () => '< doc _ start >')
            .concat(sentences)
            .concat(Array.from({length: nContextSentences}, () => '< doc _ end >'));

        let encoded_sents = await Promise.all(paddedSents.map(async sent => this.tokenizer.encode(sent)));

        for (let i = nContextSentences; i < paddedSents.length - nContextSentences; i++) {
            var start_context = Math.max(i-nContextSentences, 0);
            var end_context = Math.min(i+nContextSentences, sentences.length)+1;

            var pre_context: number[][] = encoded_sents.slice(start_context, i).map((a): number[] => a.getIds());
            var cur_sent: number[] = encoded_sents[i].getIds();
            var post_context: number[][] = encoded_sents.slice(i+1, end_context).map((a): number[] => a.getIds());

            var input_length = pre_context.reduce((a,b) => a + b.length, 0)
                + cur_sent.length
                + post_context.reduce((a,b) => a + b.length, 0);

            if (cur_sent.length > 512) {
                /**
                 * In the python implementation of the collator, if the current sentence is
                 * too long then we split it in half and use only the second half. We also 
                 * keep the first `nContextSentences' tokens. It doesn't really make sense to
                 * me why we should do this. I've implemented it the same here for the sake of
                 * consistency but we should probably change this if we have the opportunity.
                 */
                let input_ids = cur_sent.slice(0,nContextSentences)
                    .concat(cur_sent.slice(cur_sent.length / 2));

                let cur_attn = encoded_sents[i].getAttentionMask();
                let attention_mask: number[] = cur_attn.slice(0,nContextSentences)
                    .concat(cur_attn.slice(cur_sent.length / 2));
                
                let cur_tids: number[] = encoded_sents[i].getTypeIds();
                let token_type_ids = cur_tids.slice(0,nContextSentences)
                    .concat(cur_tids.slice(cur_sent.length / 2));
                
                output.push({
                    input_ids: new Tensor(
                        new BigInt64Array(input_ids.map(BigInt)),
                        [1, input_ids.length],
                    ),
                    attention_mask: new Tensor(
                        new BigInt64Array(attention_mask.map(BigInt)),
                        [1, attention_mask.length],
                    ),                        
                    token_type_ids: new Tensor(
                        new BigInt64Array(token_type_ids.map(BigInt)),
                        [1, token_type_ids.length],
                    ),
                })
                continue;
            }

            var trim_start = true;
            if (pre_context.length < 1) {
                trim_start = false;
            } else if (post_context.length > 0) {
                trim_start = pre_context[0].length > post_context[post_context.length-1].length;
            }
            
            while (input_length > 512) {
                if (trim_start) {
                    pre_context.shift();
                    start_context++;
                } else {
                    post_context.pop();
                    end_context--;
                }
                trim_start = !trim_start;

                input_length = pre_context.reduce((a, b) => a + b.length, 0) 
                    + cur_sent.length
                    + post_context.reduce((a,b) => a + b.length, 0);
            }

            output.push(this.createOutput(
                encoded_sents,
                i, // index to center on
                start_context,
                end_context
            ));
        }

        return output;
    }

    private joinAttentions(
        encoded_sents: any[],
        index: number,
        start_context: number,
        end_context: number,
    ): TypedTensor<"int64"> {
        const pre_context_attn = encoded_sents
            .slice(start_context, index)
            .map((a) => a.getAttentionMask().slice(1))
            .reduce((a:number[],b) => a.concat(b), []);
        const post_context_attn = encoded_sents
            .slice(index+1, end_context)
            .map((a) => a.getAttentionMask().slice(1))
            .reduce((a:number[],b) => a.concat(b), []);

        let attention_mask: number[] = [1]
            .concat(pre_context_attn)
            .concat(encoded_sents[index].getAttentionMask().slice(1))
            .concat(post_context_attn);
        
        return new Tensor(
            new BigInt64Array(attention_mask.map(BigInt)),
            [1, attention_mask.length],
        );
    }

    private joinTokenIds(
        sentence_len: number,
        pre_context_len: number,
        post_context_len: number,
    ): TypedTensor<"int64"> {
        let token_type_ids: number[] = this.typeVector(pre_context_len, 1)
            .concat(this.typeVector(sentence_len-1, 0)) // [SEP] token should be in context
            .concat(this.typeVector(post_context_len+1, 1));

        return new Tensor(
        new BigInt64Array(token_type_ids.map(BigInt)), 
            [1, token_type_ids.length],
        );
    }

    private createOutput(
        encoded_sents: any[],
        index: number,
        start_context: number,
        end_context: number,
    ): CLIPInput {
        const sentence_ids: number[] = encoded_sents[index].getIds().slice(1);
        const pre_context_ids = encoded_sents.slice(start_context, index)
            .map((a) => a.getIds().slice(1)) // slice to remove `[CLS]` token
            .reduce((a:number[],b) => a.concat(b), []);
        const post_context_ids = encoded_sents.slice(index+1, end_context)
            .map((a) => a.getIds().slice(1))
            .reduce((a:number[], b) => a.concat(b), []);
        let input_ids_array: number[] = [Tokenizer.CLS]
            .concat(pre_context_ids)
            .concat(sentence_ids)
            .concat(post_context_ids);
        
        let input_ids = new Tensor(
            new BigInt64Array(input_ids_array.map(BigInt)),
            [1, input_ids_array.length]
        );

        return {
            input_ids: input_ids, 
            attention_mask: this.joinAttentions(
                encoded_sents,
                index, 
                start_context, 
                end_context
            ),
            token_type_ids: this.joinTokenIds(
                sentence_ids.length + 1, // add 1 for `[CLS]` token
                pre_context_ids.length, 
                post_context_ids.length
            ),
        }
    }

    private typeVector(length: number, value: number): number[] {
        return Array.from({length}, () => value);
    }
}
