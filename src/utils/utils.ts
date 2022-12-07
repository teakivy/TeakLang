export function isNumeric(value: string): boolean {
	return /^[0-9]+$/.test(value);
}

export function isAlpha(value: string): boolean {
	return /^[a-zA-Z]+$/.test(value);
}

export function isAlphaNumeric(value: string): boolean {
	return /^[a-zA-Z0-9]+$/.test(value);
}

export function isWhitespace(value: string): boolean {
	let keys = [" ", "\t", "\r"];
	return keys.includes(value);
}

export function isNewLine(value: string): boolean {
	let keys = ["\r", "\n"];
	return keys.includes(value);
}

export function isOperatorSymbol(value: string): boolean {
	let keys = ["+", "-", "*", "/", "%", ">", "<", "^", "=", "!", "&", "|"];
	return keys.includes(value);
}
