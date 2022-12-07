export function isNumeric(value) {
    return /^[0-9]+$/.test(value);
}
export function isAlpha(value) {
    return /^[a-zA-Z]+$/.test(value);
}
export function isAlphaNumeric(value) {
    return /^[a-zA-Z0-9]+$/.test(value);
}
export function isWhitespace(value) {
    let keys = [" ", "\t", "\r", "\n"];
    return keys.includes(value);
}
export function isNewLine(value) {
    let keys = ["\r", "\n"];
    return keys.includes(value);
}
export function isOperatorSymbol(value) {
    let keys = ["+", "-", "*", "/", "%", ">", "<", "^", "=", "!", "&", "|"];
    return keys.includes(value);
}
