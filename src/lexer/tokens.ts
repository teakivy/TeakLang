export type TokenType =
	| "DATA_TYPE"
	| "IDENTIFIER"
	| "FLOATING_POINT"
	| "INTEGER"
	| "STRING"
	| "WHITE_SPACE"
	| "COMMENT"
	| "END_STATEMENT"
	| "ASSIGNMENT"
	| "UNARY_OPERATOR"
	| "BINARY_OPERATOR"
	| "KEYWORD"
	| "BRACE";

export type TokenDeclaration = {
	type: TokenType;
	match: string | RegExp | string[];
	value?: boolean;
};

export const tokens: TokenDeclaration[] = [
	{
		type: "WHITE_SPACE",
		match: [" ", "\t", "\r", "\n"],
	},
	{
		type: "DATA_TYPE",
		match: ["int", "float", "string", "bool"],
		value: true,
	},
	{
		type: "STRING",
		match: /"(?:\\["\\]|[^\n"\\])*"/,
		value: true,
	},
	{
		type: "FLOATING_POINT",
		match: /(\d*\.\d+)/,
		value: true,
	},
	{
		type: "INTEGER",
		match: /\d+/,
		value: true,
	},
	{
		type: "COMMENT",
		match: /\/\/.*/,
	},
	{
		type: "END_STATEMENT",
		match: ";",
	},
	{
		type: "ASSIGNMENT",
		match: "=",
	},
	{
		type: "UNARY_OPERATOR",
		match: ["++", "--", "!"],
		value: true,
	},
	{
		type: "BINARY_OPERATOR",
		match: [
			"+",
			"-",
			"*",
			"/",
			"%",
			">",
			"<",
			">=",
			"<=",
			"==",
			"!=",
			"&&",
			"||",
			"^",
		],
		value: true,
	},
	{
		type: "KEYWORD",
		match: [
			"if",
			"else",
			"while",
			"for",
			"return",
			"break",
			"continue",
			"true",
			"false",
		],
		value: true,
	},
	{
		type: "BRACE",
		match: ["(", ")", "{", "}", "[", "]"],
		value: true,
	},
	{
		type: "IDENTIFIER",
		match: /[a-zA-Z_][a-zA-Z0-9_]*/,
		value: true,
	},
];
