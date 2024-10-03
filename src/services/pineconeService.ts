// src/services/pineconeService.ts

import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from '../config/environment';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: CONFIG.PINECONE_API_KEY,
});

export async function storeInPinecone(embeddings: number[][], docId: string) {
  const index = pinecone.Index(CONFIG.PINECONE_INDEX_NAME);

  // Prepare vectors to upsert
  const vectors = embeddings.map((embedding, i) => ({
    id: `${docId}-chunk-${i}`,
    values: embedding,
    metadata: { docId, chunkIndex: i }
  }));

  // Perform upsert
  await index.upsert(vectors);
}

export async function searchPinecone(queryEmbedding: number[], topK: number = 5) {
  const index = pinecone.Index(CONFIG.PINECONE_INDEX_NAME);

  return await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });
}
