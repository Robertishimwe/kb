// src/utils/textProcessing.ts

export function splitText(text: string, maxTokens: number = 500): string[] {
    // Implement the improved text splitting function here
    // This is a placeholder implementation
    return text.split(' ').reduce((acc: string[], word) => {
      if (!acc.length || (acc[acc.length - 1] + ' ' + word).length > maxTokens) {
        acc.push(word);
      } else {
        acc[acc.length - 1] += ' ' + word;
      }
      return acc;
    }, []);
  }