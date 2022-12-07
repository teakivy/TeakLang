// import chalk
import chalk from "chalk";

export const throwError = (processName: string, message: string) => {
	console.log(
		chalk.red.bold(
			`\n  ✖   Error during ${chalk.blueBright(processName)}:\n`
		)
	);
	console.log(message + "\n");
	process.exit(0);
};
