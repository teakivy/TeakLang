import {
	isWhitespace,
	isNumeric,
	isAlpha,
	isAlphaNumeric,
	isNewLine,
	isOperatorSymbol,
} from "../utils";
// import { tokens } from "./tokens";

type TokenIndex = {
	type: string;
	index: number;
	value?: string;
};

type TokenDeclaration = {
	type: string;
	match: string | RegExp | string[];
	value?: boolean;
};

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
];

const dataTypes = ["int", "float", "string", "bool"];

const unaryOperatorsDouble = ["++", "--"];

const unaryOperatorsSingle = ["!"];

const binaryOperatorsSingle = ["+", "-", "*", "/", "%", ">", "<", "^"];

const binaryOperatorsDouble = ["==", "!=", ">=", "<=", "&&", "||"];

const symbols = ["(", ")", "{", "}", "[", "]", ";", "="];

export class Lexer {
	// private tokens: TokenDeclaration[];
	private source: string;
	private index: number;
	private line: number;
	private column: number;
	private tokenIndex: number;

	constructor(source: string) {
		// this.tokens = tokens;
		this.source = source + "\n";
		this.index = 0;
		this.line = 1;
		this.column = 1;
		this.tokenIndex = -1;
	}

	public lex(): TokenIndex[] {
		const tokens: TokenIndex[] = [];

		while (this.index < this.source.length) {
			const token = this.getNextToken();

			if (token) {
				tokens.push(token);
			}
		}

		return tokens;
	}

	private getNextToken(): TokenIndex | undefined {
		const char = this.source[this.index];
		this.tokenIndex++;

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

			if (
				binaryOperatorsDouble.includes(value + this.source[this.index])
			) {
				value += this.source[this.index];
				this.index++;
				this.column++;

				return {
					type: "BINARY_OPERATOR",
					index: this.tokenIndex,
					value,
				};
			}

			if (
				unaryOperatorsDouble.includes(value + this.source[this.index])
			) {
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

			if (char === "!" && !isOperatorSymbol(this.source[this.index])) {
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

			throw new Error(
				`Invalid operator symbol: ${value} at line ${this.line} column ${this.column}`
			);
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
			}

			let returnValue: TokenIndex = {
				type,
				index: this.tokenIndex,
			};

			if (giveValue) {
				returnValue.value = value;
			}

			return returnValue;
		}

		throw new Error(
			`Invalid character: ${char} at line ${this.line} column ${this.column}`
		);
	}

	private ci(): boolean {
		return this.index < this.source.length;
	}

	private isReserved(value: string): boolean {
		return reserved.includes(value);
	}

	private isDataType(value: string): boolean {
		return dataTypes.includes(value);
	}
}
