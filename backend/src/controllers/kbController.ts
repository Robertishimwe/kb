// src/controllers/kbController.ts

import { Request, Response } from 'express';
import { KBEntry } from '../models/kbEntry';
import { splitText } from '../utils/textProcessing';
import { generateEmbeddings } from '../services/embeddingService';
import { storeInPinecone, searchPinecone } from '../services/pineconeService';
import { storeInSQL, getKBEntryByTitle } from '../services/prismaService';

export async function addKBEntry(req: Request, res: Response) {

  try {
    const entry: KBEntry = req.body;
    const fullText = `
      Title: ${entry.title}
      Environment: ${entry.environment}
      Issue: ${entry.issue}
      Products: ${entry.products}
      Resolution: ${entry.resolution}
    `;

    const chunks = splitText(fullText);
    const embeddings = await generateEmbeddings(chunks);

    await storeInPinecone(embeddings, entry.title);
    const storedEntry = await storeInSQL(entry);

    res.status(201).json(storedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add KB entry', traces: error });
  }
}

export async function searchKB(req: Request, res: Response) {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameter' });
    }

    const queryEmbedding = await generateEmbeddings([query]);

    const searchResults = await searchPinecone(queryEmbedding[0]);

    const kbEntries = await Promise.all(
      searchResults.matches.map(match => 
        getKBEntryByTitle(match.metadata?.docId as string)
      )
    );

    // res.json(kbEntries.filter(entry => entry !== null));
    // res.json(kbEntries);



    const uniqueEntries = Array.from(
      new Map(
        kbEntries
          .flat()
          .filter(entry => entry !== null)
          .map(entry => [entry.title, entry]) // Using title as the unique identifier
      ).values()
    );
    
    res.json(uniqueEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search KB', traces: error });
  }
}
