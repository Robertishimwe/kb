import { HfInference } from '@huggingface/inference';
import { CONFIG } from '../config/environment';

const hf = new HfInference(CONFIG.HUGGINGFACE_API_KEY);

export async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
  const embeddingResponses = await Promise.all(
    chunks.map(async chunk => {
      const response = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: chunk,
      });
      return response;
    })
  );

  // console.log(embeddingResponses)
  return embeddingResponses as number[][];
}


































// src/services/embeddingService.ts

// import { Configuration, OpenAIApi } from 'openai';
// import { CONFIG } from '../config/environment';

// const openai = new OpenAIApi(new Configuration({ apiKey: CONFIG.OPENAI_API_KEY }));

// export async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
//   const embeddingResponses = await Promise.all(
//     chunks.map(chunk => 
//       openai.createEmbedding({
//         model: "text-embedding-ada-002",
//         input: chunk,
//       })
//     )
//   );

//   return embeddingResponses.map(res => res.data.data[0].embedding);
// }
