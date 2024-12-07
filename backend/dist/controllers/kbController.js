"use strict";
// src/controllers/kbController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKBEntry = addKBEntry;
exports.searchKB = searchKB;
exports.getAllKB = getAllKB;
const textProcessing_1 = __importDefault(require("../utils/textProcessing"));
const embeddingService_1 = require("../services/embeddingService");
const pineconeService_1 = require("../services/pineconeService");
const prismaService_1 = require("../services/prismaService");
async function addKBEntry(req, res) {
    try {
        const entry = req.body;
        const fullText = `
      Title: ${entry.title}
      Environment: ${entry.environment}
      Issue: ${entry.issue}
      Products: ${entry.products}
      Resolution: ${entry.resolution}
    `;
        const chunks = (0, textProcessing_1.default)(fullText);
        const embeddings = await (0, embeddingService_1.generateEmbeddings)(chunks);
        await (0, pineconeService_1.storeInPinecone)(embeddings, entry.title);
        const storedEntry = await (0, prismaService_1.storeInSQL)(entry);
        res.status(201).json(storedEntry);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add KB entry', traces: error });
    }
}
async function searchKB(req, res) {
    try {
        const { query } = req.query;
        if (typeof query !== 'string') {
            return res.status(400).json({ error: 'Invalid query parameter' });
        }
        const queryEmbedding = await (0, embeddingService_1.generateEmbeddings)([query]);
        const searchResults = await (0, pineconeService_1.searchPinecone)(queryEmbedding[0]);
        const kbEntries = await Promise.all(searchResults.matches.map(match => { var _a; return (0, prismaService_1.getKBEntryByTitle)((_a = match.metadata) === null || _a === void 0 ? void 0 : _a.docId); }));
        // res.json(kbEntries.filter(entry => entry !== null));
        // res.json(kbEntries);
        const uniqueEntries = Array.from(new Map(kbEntries
            .flat()
            .filter(entry => entry !== null)
            .map(entry => [entry.title, entry]) // Using title as the unique identifier
        ).values());
        res.json(uniqueEntries);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search KB', traces: error });
    }
}
async function getAllKB(req, res) {
    try {
        const results = await (0, prismaService_1.getAllKBEntries)();
        console.log(results);
        res.status(200).json(results);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get KB', traces: error });
    }
}
