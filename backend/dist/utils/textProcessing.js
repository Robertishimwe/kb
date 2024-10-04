"use strict";
// src/utils/textProcessing.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitText = splitText;
function splitText(text, maxTokens = 500) {
    // Implement the improved text splitting function here
    // This is a placeholder implementation
    return text.split(' ').reduce((acc, word) => {
        if (!acc.length || (acc[acc.length - 1] + ' ' + word).length > maxTokens) {
            acc.push(word);
        }
        else {
            acc[acc.length - 1] += ' ' + word;
        }
        return acc;
    }, []);
}
