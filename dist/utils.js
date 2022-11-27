"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOperatorSymbol = exports.isNewLine = exports.isWhitespace = exports.isAlphaNumeric = exports.isAlpha = exports.isNumeric = void 0;
function isNumeric(value) {
    return /^[0-9]+$/.test(value);
}
exports.isNumeric = isNumeric;
function isAlpha(value) {
    return /^[a-zA-Z]+$/.test(value);
}
exports.isAlpha = isAlpha;
function isAlphaNumeric(value) {
    return /^[a-zA-Z0-9]+$/.test(value);
}
exports.isAlphaNumeric = isAlphaNumeric;
function isWhitespace(value) {
    let keys = [" ", "\t", "\r", "\n"];
    return keys.includes(value);
}
exports.isWhitespace = isWhitespace;
function isNewLine(value) {
    let keys = ["\r", "\n"];
    return keys.includes(value);
}
exports.isNewLine = isNewLine;
function isOperatorSymbol(value) {
    let keys = ["+", "-", "*", "/", "%", ">", "<", "^", "=", "!", "&", "|"];
    return keys.includes(value);
}
exports.isOperatorSymbol = isOperatorSymbol;
