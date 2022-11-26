"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const tokens_1 = require("./tokens");
class Lexer {
    constructor(source) {
        this.tokens = tokens_1.tokens;
        this.source = source;
        this.index = 0;
        this.line = 1;
        this.column = 1;
    }
    lex() {
        const tokens = [];
        while (this.index < this.source.length) {
            const token = this.getNextToken();
            if (token) {
                tokens.push(token);
            }
        }
        return tokens;
    }
    getNextToken() {
        const source = this.source.slice(this.index);
        for (const token of this.tokens) {
            let match;
            if (typeof token.match === "string") {
                if (source.startsWith(token.match)) {
                    this.index += token.match.length;
                    this.column += token.match.length;
                    let rValue = {
                        type: token.type,
                    };
                    if (token.value) {
                        rValue.value = token.match;
                    }
                    return rValue;
                }
            }
            else if (token.match instanceof RegExp) {
                match = source.match(token.match);
            }
            else if (Array.isArray(token.match)) {
                for (const matchString of token.match) {
                    if (source.startsWith(matchString)) {
                        this.index += matchString.length;
                        this.column += matchString.length;
                        let rValue = {
                            type: token.type,
                        };
                        if (token.value) {
                            rValue.value = matchString;
                        }
                        return rValue;
                    }
                }
            }
            if (match) {
                const value = token.value ? match[0] : undefined;
                this.index += match[0].length;
                this.column += match[0].length;
                let rValue = {
                    type: token.type,
                };
                if (token.value) {
                    rValue.value = value;
                }
                return rValue;
            }
        }
        throw new Error(`Unexpected token " ${source.split(" ")[0]} " at line ${this.line} and column ${this.column}`);
    }
}
exports.Lexer = Lexer;
