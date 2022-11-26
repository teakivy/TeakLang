const { Lexer } = require("../dist/lexer/lexer");
const { exec } = require("child_process");

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

		let source = "int a = 2;\nint b = 4;\nint c = a + b;\nprint (c);";

		console.log("\n" + source + "\n");

		const lexer = new Lexer(source);

		console.log(lexer.lex());
	});
}

run();
