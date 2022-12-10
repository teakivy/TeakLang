import chalk from "chalk";
import { Token } from "../types/types.js";
import { throwError } from "../utils/errorHandler.js";

export class AbstractParser {
	public processName: string;
	public tokens: Token[];
	public index: number = 0;
	public line: number = 1;
	public column: number = 1;
	public filename: string;

	constructor(d: {
		processName: string;
		tokens: Token[];
		filename: string;
		index: number;
		line: number;
		column: number;
	}) {
		this.processName = d.processName;
		this.tokens = d.tokens;
		this.filename = d.filename;
		this.index = d.index;
		this.line = d.line;
		this.column = d.column;
	}

	public parse(): void {}

	public getNextToken(): Token | undefined {
		const token = this.tokens[this.index];
		this.index++;

		if (token === undefined) return;
		if (token.type === "WHITE_SPACE" || token.type === "COMMENT")
			return this.getNextToken();

		this.line = token.line;
		this.column = token.column;

		return token;
	}

	public peek(steps = 1): Token | undefined {
		let tok = this.tokens[this.index + steps - 1];

		if (tok === undefined) return;

		while (tok.type === "WHITE_SPACE" || tok.type === "COMMENT") {
			steps++;
			tok = this.tokens[this.index + steps - 1];
		}

		return tok;
	}

	public throwParseError(message: string): never {
		return throwError(
			this.processName,
			chalk.blue.bold(this.filename) +
				chalk.redBright.bold("  >  ") +
				chalk.blueBright.bold(`[${this.line}:${this.column}]`) +
				chalk.red(`\n    ${message}`)
		);
	}
}
