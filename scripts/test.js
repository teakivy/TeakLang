import { Lexer } from "../dist/lexer/lexer.js";
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
	console.log(lexed);
}

run("/tests/ex1.tea");
