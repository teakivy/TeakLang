import { isWhitespace, isNumeric, isAlpha, isAlphaNumeric, isNewLine, isOperatorSymbol, } from "../utils/utils.js";
import chalk from "chalk";
import { throwError } from "../utils/errorHandler.js";
const reserved = [
    "if",
    "else",
    "while",
    "for",
    "return",
    "break",
    "continue",
    "true",
    "false",
    "null",
    "module",
    "import",
    "from",
    "private",
    "public",
    "const",
    "func",
];
const dataTypes = ["int", "float", "string", "bool"];
const unaryOperatorsDouble = ["++", "--"];
const unaryOperatorsSingle = ["!"];
const binaryOperatorsSingle = ["+", "-", "*", "/", "%", ">", "<", "^"];
const binaryOperatorsDouble = ["->", "==", "!=", ">=", "<=", "&&", "||"];
const symbols = ["(", ")", "{", "}", "[", "]", ";", "=", ".", ","];
export class Lexer {
    constructor(source, filename) {
        // this.tokens = tokens;
        this.source = source + "\n";
        this.index = 0;
        this.line = 1;
        this.column = 1;
        this.tokenIndex = -1;
        this.filename = filename;
    }
    lex() {
        const tokens = [];
        while (this.index < this.source.length) {
            const token = this.getNextToken();
            if (token === undefined) {
                return throwError("Lexer", chalk.red.bold(`Unexpected character '${this.source[this.index]}' at line ${this.line}, column ${this.column}`));
            }
            tokens.push(token);
        }
        return tokens;
    }
    getNextToken() {
        const char = this.source[this.index];
        this.tokenIndex++;
        if (char === "\n") {
            this.index++;
            this.line++;
            this.column = 1;
            while (isWhitespace(this.source[this.index]) && this.ci()) {
                this.index++;
                this.column++;
            }
            return {
                type: "WHITE_SPACE",
                index: this.tokenIndex,
            };
        }
        if (isWhitespace(char)) {
            this.index++;
            this.column++;
            while (isWhitespace(this.source[this.index]) && this.ci()) {
                this.index++;
                this.column++;
            }
            return {
                type: "WHITE_SPACE",
                index: this.tokenIndex,
            };
        }
        if (char === '"') {
            let value = "";
            this.index++;
            this.column++;
            while (this.source[this.index] !== '"' && this.ci()) {
                value += this.source[this.index];
                this.index++;
                this.column++;
            }
            this.index++;
            this.column++;
            return {
                type: "STRING",
                index: this.tokenIndex,
                value,
            };
        }
        if (char === "/") {
            if (this.source[this.index + 1] === "/") {
                let value = "";
                this.index += 2;
                this.column += 2;
                while (!isNewLine(this.source[this.index]) && this.ci()) {
                    value += this.source[this.index];
                    this.index++;
                    this.column++;
                }
                return {
                    type: "COMMENT",
                    index: this.tokenIndex,
                    value: value.trim(),
                };
            }
        }
        if (isNumeric(char)) {
            let value = char;
            this.index++;
            this.column++;
            while (isNumeric(this.source[this.index]) && this.ci()) {
                value += this.source[this.index];
                this.index++;
                this.column++;
            }
            return {
                type: "NUMBER",
                index: this.tokenIndex,
                value,
            };
        }
        if (isAlpha(char)) {
            let value = char;
            this.index++;
            this.column++;
            while (isAlphaNumeric(this.source[this.index]) && this.ci()) {
                value += this.source[this.index];
                this.index++;
                this.column++;
            }
            return {
                type: this.isReserved(value)
                    ? "KEYWORD"
                    : this.isDataType(value)
                        ? "DATA_TYPE"
                        : "IDENTIFIER",
                index: this.tokenIndex,
                value,
            };
        }
        if (isOperatorSymbol(char)) {
            let value = char;
            this.index++;
            this.column++;
            if (binaryOperatorsDouble.includes(value + this.source[this.index])) {
                value += this.source[this.index];
                this.index++;
                this.column++;
                return {
                    type: "BINARY_OPERATOR",
                    index: this.tokenIndex,
                    value,
                };
            }
            if (unaryOperatorsDouble.includes(value + this.source[this.index])) {
                value += this.source[this.index];
                this.index++;
                this.column++;
                return {
                    type: "UNARY_OPERATOR",
                    index: this.tokenIndex,
                    value,
                };
            }
            if (binaryOperatorsSingle.includes(value)) {
                return {
                    type: "BINARY_OPERATOR",
                    index: this.tokenIndex,
                    value,
                };
            }
            if (unaryOperatorsSingle.includes(char) &&
                !isOperatorSymbol(this.source[this.index])) {
                return {
                    type: "UNARY_OPERATOR",
                    index: this.tokenIndex,
                    value,
                };
            }
            if (char === "=" && !isOperatorSymbol(this.source[this.index])) {
                return {
                    type: "ASSIGNMENT_OPERATOR",
                    index: this.tokenIndex,
                    value,
                };
            }
            throw new Error(`Invalid operator symbol: ${value} at line ${this.line} column ${this.column}`);
        }
        if (symbols.includes(char)) {
            let value = "";
            this.index++;
            this.column++;
            let type = "SYMBOL";
            let giveValue = false;
            switch (char) {
                case ";": {
                    type = "END_OF_STATEMENT";
                    break;
                }
                case "(": {
                    type = "L_PAREN";
                    break;
                }
                case ")": {
                    type = "R_PAREN";
                    break;
                }
                case "{": {
                    type = "L_BRACE";
                    break;
                }
                case "}": {
                    type = "R_BRACE";
                    break;
                }
                case "[": {
                    type = "L_BRACKET";
                    break;
                }
                case "]": {
                    type = "R_BRACKET";
                    break;
                }
                case "=": {
                    type = "ASSIGNMENT_OPERATOR";
                    break;
                }
                case ",": {
                    type = "SEPARATOR";
                    break;
                }
                case ".": {
                    type = "ACCESSOR";
                    break;
                }
            }
            let returnValue = {
                type,
                index: this.tokenIndex,
            };
            if (giveValue) {
                returnValue.value = value;
            }
            return returnValue;
        }
        return this.throwLexerError(`Invalid character: " ` + chalk.yellow(char) + ` "`);
    }
    ci() {
        return this.index < this.source.length;
    }
    isReserved(value) {
        return reserved.includes(value);
    }
    isDataType(value) {
        return dataTypes.includes(value);
    }
    throwLexerError(message) {
        return throwError("Lexer", chalk.blue.bold(this.filename) +
            chalk.redBright.bold("  >  ") +
            chalk.blueBright.bold(`[${this.line}:${this.column}]`) +
            chalk.red(`\n    ${message}`));
    }
}
