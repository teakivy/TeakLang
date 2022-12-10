import {
	isWhitespace,
	isNumeric,
	isAlpha,
	isAlphaNumeric,
	isNewLine,
	isOperatorSymbol,
} from "../utils/utils.js";
import chalk from "chalk";
import { throwError } from "../utils/errorHandler.js";
import { Token } from "../types/types.js";

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
	"const",
];

const dataTypes = ["int", "float", "string", "bool"];

const unaryOperatorsDouble = ["++", "--"];

const unaryOperatorsSingle = ["!"];

const binaryOperatorsSingle = ["+", "-", "*", "/", "%", ">", "<", "^"];

const binaryOperatorsDouble = ["->", "==", "!=", ">=", "<=", "&&", "||"];

const symbols = ["(", ")", "{", "}", "[", "]", ";", "=", ".", ","];

export class Lexer {
	// private tokens: TokenDeclaration[];
	private source: string;
	private index: number;
	private line: number;
	private column: number;
	private tokenIndex: number;
	private filename: string;

	constructor(source: string, filename: string) {
		// this.tokens = tokens;
		this.source = source + "\n";
		this.index = 0;
		this.line = 1;
		this.column = 1;
		this.tokenIndex = -1;
		this.filename = filename;
	}

	public lex(): Token[] {
		const tokens: Token[] = [];

		while (this.index < this.source.length) {
			const token = this.getNextToken();

			if (token === undefined) {
				return throwError(
					"Lexer",
					chalk.red.bold(
						`Unexpected character '${
							this.source[this.index]
						}' at line ${this.line}, column ${this.column}`
					)
				);
			}

			tokens.push(token);
		}

		return tokens;
	}

	private getNextToken(): Token | undefined {
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
				line: this.line,
				column: this.column,
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
				line: this.line,
				column: this.column,
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
				line: this.line,
				column: this.column,
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
					line: this.line,
					column: this.column,
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
				line: this.line,
				column: this.column,
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
				line: this.line,
				column: this.column,
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
					line: this.line,
					column: this.column,
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
					line: this.line,
					column: this.column,
				};
			}

			if (binaryOperatorsSingle.includes(value)) {
				return {
					type: "BINARY_OPERATOR",
					index: this.tokenIndex,
					value,
					line: this.line,
					column: this.column,
				};
			}

			if (
				unaryOperatorsSingle.includes(char) &&
				!isOperatorSymbol(this.source[this.index])
			) {
				return {
					type: "UNARY_OPERATOR",
					index: this.tokenIndex,
					value,
					line: this.line,
					column: this.column,
				};
			}

			if (char === "=" && !isOperatorSymbol(this.source[this.index])) {
				return {
					type: "ASSIGNMENT_OPERATOR",
					index: this.tokenIndex,
					value,
					line: this.line,
					column: this.column,
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
				case ",": {
					type = "SEPARATOR";
					break;
				}
				case ".": {
					type = "ACCESSOR";
					break;
				}
			}

			let returnValue: Token = {
				type,
				index: this.tokenIndex,
				line: this.line,
				column: this.column,
			};

			if (giveValue) {
				returnValue.value = value;
			}

			return returnValue;
		}

		return this.throwLexerError(
			`Invalid character: " ` + chalk.yellow(char) + ` "`
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

	private throwLexerError(message: string): never {
		return throwError(
			"Lexer",
			chalk.blue.bold(this.filename) +
				chalk.redBright.bold("  >  ") +
				chalk.blueBright.bold(`[${this.line}:${this.column}]`) +
				chalk.red(`\n    ${message}`)
		);
	}
}
