import { Token, AST, Access, Constant, Expression } from "../types/types.js";
import { isAllCaps } from "../utils/utils.js";
import { AbstractParser } from "./abstractparser.js";

const representation: any = {
	END_OF_STATEMENT: ";",
};

const TOP_LEVEL = ["func", "module", "import", "const", "private", "public"];

export class Parser extends AbstractParser {
	private ast: AST;

	constructor(tokens: Token[], filename: string) {
		super({
			processName: "Top Level Parser",
			tokens,
			filename,
			index: 0,
			line: 1,
			column: 1,
		});
		this.tokens = tokens;
		this.filename = filename;

		this.ast = {
			module: "",
			entry: "main",
			imports: [],
			functions: [],
			constants: [],
		};
	}

	public parse(): void {
		this.parseTopLevel();

		console.log(JSON.stringify(this.ast, null, 2));
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
				continue;
			}

			if (token.value === "const") {
				this.parseConst();
				continue;
			}

			if (token.value === "public") {
				if (this.peek()?.type === "KEYWORD") {
					const nextToken = this.getNextToken();

					if (nextToken?.value === "const") {
						this.parseConst("public");
						continue;
					}
				}
			}

			if (token.value === "private") {
				console.log("private", this.peek());
				if (this.peek()?.type === "KEYWORD") {
					console.log("keyword");
					const nextToken = this.getNextToken();

					if (nextToken?.value === "const") {
						console.log("const");
						this.parseConst("private");
						continue;
					}
				}
			}
		}

		function isTopLevelStarter(token: Token): boolean {
			if (token.type !== "KEYWORD" || token.value === undefined)
				return false;

			return TOP_LEVEL.includes(token.value);
		}
	}

	private parseModule(): void {
		if (this.ast.module !== "") {
			return this.throwParseError("Module already defined");
		}

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

	private parseConst(access: Access = "public"): void {
		const self = this;

		const grammar = [
			"DATA_TYPE",
			"IDENTIFIER",
			"ASSIGNMENT_OPERATOR",
			"%EXPRESSION",
			"END_OF_STATEMENT",
		];

		const constant: Constant = {
			name: "",
			type: "",
			access,
			value: {
				type: "null",
				value: null,
			},
		};

		for (let i = 0; i < grammar.length; i++) {
			const token = self.getNextToken();

			// console.log(token);
			if (token === undefined) {
				return self.throwParseError("Unexpected end of file" + i);
			}

			if (token.type !== grammar[i] && !grammar[i].startsWith("%")) {
				return self.throwParseError(
					`Unexpected token '${
						token.value === undefined ? r(token.type) : token.value
					}', expected '${r(grammar[i])}'`
				);
			}

			let evalue: Expression | undefined;
			if (grammar[i].startsWith("%")) {
				const type = grammar[i].slice(1);

				if (type === "EXPRESSION") {
					const expression = new ExpressionParser(
						token,
						self.tokens,
						self.index,
						self.filename,
						self.line,
						self.column
					);

					evalue = expression.parse();

					if (evalue === undefined) {
						return self.throwParseError("Unexpected end of file");
					}

					constant.value = evalue;
					self.index = expression.index;
					self.line = expression.line;
					self.column = expression.column;
				}
			}

			if (i === 1) {
				constant.name = token.value ?? "";
			}

			if (i === 0) {
				constant.type = token.value ?? "";
			}
		}

		if (!isAllCaps(constant.name)) {
			return self.throwParseError(
				`Constant name '${constant.name}' must not contain lowercase letters`
			);
		}

		self.ast.constants.push(constant);
	}
}

function r(key: string): string {
	return representation[key] ?? key;
}

export class ExpressionParser extends AbstractParser {
	private startToken: Token;

	constructor(
		token: Token,
		tokens: Token[],
		index: number,
		filename: string,
		line: number,
		column: number
	) {
		super({
			processName: "Expression Parser",
			tokens,
			index,
			filename,
			line,
			column,
		});
		this.startToken = token;
	}

	public parse(): Expression | undefined {
		const self = this;

		const expression: Expression = {
			type: "null",
			value: null,
		};

		if (self.startToken.type === "IDENTIFIER") {
			// TODO: Add more support

			if (self.startToken.value === undefined) {
				return self.throwParseError("Error parsing identifier");
			}

			return {
				type: "identifier",
				value: self.startToken.value,
			};
		}

		if (self.startToken.type === "STRING") {
			if (self.startToken.value === undefined) {
				return self.throwParseError("Error parsing string");
			}

			return {
				type: "string",
				value: self.startToken.value,
			};
		}

		if (self.startToken.type === "NUMBER") {
			if (self.startToken.value === undefined) {
				return self.throwParseError("Error parsing number");
			}

			if (
				self.peek()?.type === "ACCESSOR" &&
				self.peek(2)?.type === "NUMBER"
			) {
				this.getNextToken();
				let tok = this.getNextToken();
				return {
					type: "floating",
					value: parseFloat(self.startToken.value + "." + tok?.value),
				};
			}

			return {
				type: "integer",
				value: parseFloat(self.startToken.value),
			};
		}

		if (self.startToken.type === "KEYWORD") {
			switch (self.startToken.value) {
				case undefined:
					return self.throwParseError("Error parsing keyword");

				case "true":
					return {
						type: "boolean",
						value: true,
					};
				case "false":
					return {
						type: "boolean",
						value: false,
					};
				case "null":
					return {
						type: "null",
						value: null,
					};
			}
		}

		return self.throwParseError(
			`Unexpected token '${
				self.startToken.value || r(self.startToken.type)
			}', expected expression`
		);
	}
}
