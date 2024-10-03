// src/config/environment.ts

import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY!,
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT!,
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME!,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY!,
};
