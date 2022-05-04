import util from 'util';
import { Tokenizer as HFTokenizer } from 'tokenizers/bindings/tokenizer';

export class Tokenizer {
    static CLS = 101;
    static SEP = 102;

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.encode = util.promisify(this.tokenizer.encode.bind(this.tokenizer));
    }

    static fromFile(path) {
        return new Tokenizer(HFTokenizer.fromFile(path));
    }

    async encode(input) {
        return this.encode(input);
    }
}