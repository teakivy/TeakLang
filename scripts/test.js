const { Lexer } = require("../dist/lexer/lexer");
const { exec } = require("child_process");
const fs = require("fs");

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

async function run() {
	await os.execCommand("yarn tsc").then(async () => {
		console.log("TypeScript compiled\n");

		// let source = process.argv
		// 	.join(" ")
		// 	.replace(`${process.argv[0]} ${process.argv[1]} `, "");

		let source = fs.readFileSync("./scripts/tests/ex1.teak", "utf8");

		console.log("\n" + source + "\n");

		const lexer = new Lexer(source);

		console.log(lexer.lex());
	});
}

run();
