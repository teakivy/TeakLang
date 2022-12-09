import { Lexer } from "../dist/lexer/lexer.js";
import { Parser } from "../dist/parser/parser.js";
import { exec } from "child_process";
import fs from "fs";

function os_func() {
	this.execCommand = function (cmd) {
		return new Promise((resolve, reject) => {
			exec(cmd, (error, stdout, stderr) => {
				resolve(stdout);
			});
		});
	};
}
const os = new os_func();

async function run(fileName) {
	let source = fs.readFileSync("./scripts" + fileName, "utf8");

	// console.log("\n" + source + "\n");

	const lexer = new Lexer(source, fileName);

	const lexed = lexer.lex();

	const parser = new Parser(lexed, fileName);

	parser.parse();
}

run("/tests/ex0.tea");
