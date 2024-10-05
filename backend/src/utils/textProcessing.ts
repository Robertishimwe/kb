// src/utils/textProcessing.ts
import natural from 'natural';
const tokenizer = new natural.WordTokenizer();

// Provide an array of abbreviations as an argument for the SentenceTokenizer
const sentenceTokenizer = new natural.SentenceTokenizer([]); // Empty array if no specific abbreviations are needed

const splitText = (text: string, maxTokens: number = 500, overlapTokens: number = 50): string[] => {
  const chunks: string[] = [];
  const sentences = sentenceTokenizer.tokenize(text);
  let currentChunk: string[] = [];
  let currentTokenCount = 0;

  for (const sentence of sentences) {
    const sentenceTokens = tokenizer.tokenize(sentence);

    if (currentTokenCount + sentenceTokens.length > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      currentChunk = currentChunk.slice(-Math.floor(overlapTokens / 2));
      currentTokenCount = currentChunk.reduce((count, sent) => count + tokenizer.tokenize(sent).length, 0);
    }

    currentChunk.push(sentence);
    currentTokenCount += sentenceTokens.length;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
};

export default splitText;









// import natural from 'natural';
// const tokenizer = new natural.WordTokenizer();

// const splitText = (text: string, maxTokens: number = 500, overlapTokens: number = 50): string[] => {
//   const chunks: string[] = [];
//   const sentenceTokenizer = new natural.SentenceTokenizer();
//   const sentences = sentenceTokenizer.tokenize(text);
//   let currentChunk: string[] = [];
//   let currentTokenCount = 0;

//   for (const sentence of sentences) {
//     const sentenceTokens = tokenizer.tokenize(sentence);

//     if (currentTokenCount + sentenceTokens.length > maxTokens && currentChunk.length > 0) {
//       chunks.push(currentChunk.join(' '));
//       currentChunk = currentChunk.slice(-Math.floor(overlapTokens / 2));
//       currentTokenCount = currentChunk.reduce((count, sent) => count + tokenizer.tokenize(sent).length, 0);
//     }

//     currentChunk.push(sentence);
//     currentTokenCount += sentenceTokens.length;
//   }

//   if (currentChunk.length > 0) {
//     chunks.push(currentChunk.join(' '));
//   }

//   return chunks;
// };

// export default splitText;























































































































































// const natural = require('natural');
// const tokenizer = new natural.WordTokenizer();

// const splitText = (text, maxTokens = 500, overlapTokens = 50) => {
//   const chunks = [];
//   const sentences = natural.SentenceTokenizer().tokenize(text);
//   let currentChunk = [];
//   let currentTokenCount = 0;

//   for (const sentence of sentences) {
//     const sentenceTokens = tokenizer.tokenize(sentence);
    
//     if (currentTokenCount + sentenceTokens.length > maxTokens && currentChunk.length > 0) {
//       chunks.push(currentChunk.join(' '));
//       currentChunk = currentChunk.slice(-Math.floor(overlapTokens / 2));
//       currentTokenCount = currentChunk.reduce((count, sent) => count + tokenizer.tokenize(sent).length, 0);
//     }

//     currentChunk.push(sentence);
//     currentTokenCount += sentenceTokens.length;
//   }

//   if (currentChunk.length > 0) {
//     chunks.push(currentChunk.join(' '));
//   }

//   return chunks;
// };





















// export function splitText(text: string, maxTokens: number = 500): string[] {
//     // Implement the improved text splitting function here
//     // This is a placeholder implementation
//     return text.split(' ').reduce((acc: string[], word) => {
//       if (!acc.length || (acc[acc.length - 1] + ' ' + word).length > maxTokens) {
//         acc.push(word);
//       } else {
//         acc[acc.length - 1] += ' ' + word;
//       }
//       return acc;
//     }, []);
//   }