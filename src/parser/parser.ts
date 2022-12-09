import chalk from "chalk";
import { Token } from "../lexer/lexer";
import { throwError } from "../utils/errorHandler.js";
import { isAlpha, isAlphaNumeric } from "../utils/utils";

type AST = {
	module: string | undefined;
	entry: string;
	imports: Import[];
	body: TLStatement[];
};

type Import = {
	module: string;
	imports: "all" | string[];
};

type TLStatement = {
	type: "func" | "const";
	name: string;
	value: null;
	access: "public" | "private";
};

const representation: any = {
	END_OF_STATEMENT: ";",
};

const TOP_LEVEL = ["func", "module", "import", "const"];

export class Parser {
	private tokens: Token[];
	private index: number = 0;
	private line: number = 1;
	private column: number = 1;
	private filename: string;
	private ast: AST;

	constructor(tokens: Token[], filename: string) {
		this.tokens = tokens;
		this.filename = filename;

		this.ast = {
			module: "",
			entry: "main",
			imports: [],
			body: [],
		};
	}

	public parse(): void {
		this.parseTopLevel();

		console.log(this.ast);
	}

	private getNextToken(): Token | undefined {
		const token = this.tokens[this.index];
		this.index++;

		if (token === undefined) return;
		if (token.type === "WHITE_SPACE") return this.getNextToken();

		this.line = token.line;
		this.column = token.column;

		return token;
	}

	private peek(steps = 1): Token | undefined {
		return this.tokens[this.index + steps - 1];
	}

	private parseTopLevel(): void {
		while (this.index < this.tokens.length) {
			const token = this.getNextToken();

			if (token === undefined) return;

			if (token.type === "WHITE_SPACE") continue;

			if (!isTopLevelStarter(token)) {
				return this.throwParseError(
					`Unexpected token '${
						token.value === undefined ? r(token.type) : token.value
					}', expected '${TOP_LEVEL.join("', '")}'`
				);
			}

			if (token.value === "module") {
				this.parseModule();
			}
		}

		function isTopLevelStarter(token: Token): boolean {
			if (token.type !== "KEYWORD" || token.value === undefined)
				return false;

			return TOP_LEVEL.includes(token.value);
		}
	}

	private parseModule(): void {
		const self = this;

		const grammar = [
			"IDENTIFIER",
			"ACCESSOR",
			"IDENTIFIER",
			"END_OF_STATEMENT",
		];

		for (let i = 0; i < grammar.length; i++) {
			const token = self.getNextToken();

			if (token === undefined) {
				return self.throwParseError("Unexpected end of file");
			}

			if (token.type !== grammar[i]) {
				return self.throwParseError(
					`Unexpected token '${
						token.value === undefined ? r(token.type) : token.value
					}', expected '${r(grammar[i])}'`
				);
			}

			if (i !== 3 && token.value !== undefined) {
				self.ast.module += token.value;
			}

			if (i === 1) {
				self.ast.module += ".";
			}
		}
	}

	private throwParseError(message: string): never {
		return throwError(
			"Parser",
			chalk.blue.bold(this.filename) +
				chalk.redBright.bold("  >  ") +
				chalk.blueBright.bold(`[${this.line}:${this.column}]`) +
				chalk.red(`\n    ${message}`)
		);
	}
}

function r(key: string): string {
	return representation[key] ?? key;
}
