"use strict";
// src/services/pineconeService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeInPinecone = storeInPinecone;
exports.searchPinecone = searchPinecone;
const pinecone_1 = require("@pinecone-database/pinecone");
const environment_1 = require("../config/environment");
// Initialize Pinecone client
const pinecone = new pinecone_1.Pinecone({
    apiKey: environment_1.CONFIG.PINECONE_API_KEY,
});
async function storeInPinecone(embeddings, docId) {
    const index = pinecone.Index(environment_1.CONFIG.PINECONE_INDEX_NAME);
    // Prepare vectors to upsert
    const vectors = embeddings.map((embedding, i) => ({
        id: `${docId}-chunk-${i}`,
        values: embedding,
        metadata: { docId, chunkIndex: i }
    }));
    // Perform upsert
    await index.upsert(vectors);
}
async function searchPinecone(queryEmbedding, topK = 5) {
    const index = pinecone.Index(environment_1.CONFIG.PINECONE_INDEX_NAME);
    const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
    });
    // console.log(results.matches || [])
    console.log(results.matches || []);
    return results;
    // return await index.query({
    //   vector: queryEmbedding,
    //   topK,
    //   includeMetadata: true,
    // });
}
