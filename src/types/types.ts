export type Access = "public" | "private";

export type AST = {
	module: string | undefined;
	entry: string;
	imports: Import[];
	functions: Function[];
	constants: Constant[];
};

export type FunctionArg = {
	name: string;
	type: string;
};

export type Function = {
	name: string;
	access: Access;
	args: FunctionArg[];
	body: Statement[];
};

export type Constant = {
	name: string;
	type: string;
	access: Access;
	value: Expression;
};

export type Expression = {
	type:
		| "string"
		| "integer"
		| "floating"
		| "boolean"
		| "null"
		| "identifier"
		| "call";
	value: string | number | boolean | null | Expression | Expression[];
};

export type Import = {
	module: string;
	imports: "all" | string[];
};

export type Statement = {
	type: "func" | "const";
	name: string;
	value: null;
	access: "public" | "private";
};

export type Token = {
	type: string;
	index: number;
	value?: string;
	line: number;
	column: number;
};
