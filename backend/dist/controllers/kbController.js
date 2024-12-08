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
const gemini_1 = __importDefault(require("../services/gemini"));
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
        res.status(500).json({ error: "Failed to add KB entry", traces: error });
    }
}
async function searchKB(req, res) {
    try {
        const { query } = req.query;
        if (typeof query !== "string") {
            return res.status(400).json({ error: "Invalid query parameter" });
        }
        const queryEmbedding = await (0, embeddingService_1.generateEmbeddings)([query]);
        const searchResults = await (0, pineconeService_1.searchPinecone)(queryEmbedding[0]);
        const kbEntries = await Promise.all(searchResults.matches.map((match) => { var _a; return (0, prismaService_1.getKBEntryByTitle)((_a = match.metadata) === null || _a === void 0 ? void 0 : _a.docId); }));
        // res.json(kbEntries.filter(entry => entry !== null));
        // res.json(kbEntries);
        const uniqueEntries = Array.from(new Map(kbEntries
            .flat()
            .filter((entry) => entry !== null)
            .map((entry) => [entry.title, entry]) // Using title as the unique identifier
        ).values());
        // adding gemini ai
        const getSummaryFromAI = async (entries) => {
            // const prompt = `I have a knowleadgebase and user is searching for this "${query}". Basing on this results ${JSON.stringify(entries)} from the database, if you think that there is a relevant answer this the users search prompt in those results from database, elaborate it. only use data from database search results. if the data from database id not relevant, just say, "Sorry data you are looking for was not found" `
            const prompt = `
    
    You are a technical support assistant helping users find solutions from our knowledge base. For the search query "${query}", analyze these knowledge base articles: ${JSON.stringify(entries)}

If relevant information is found:
1. Provide a clear, direct solution starting with the problem statement
2. List all required steps or solutions
3. For each major point, reference the source article number [Article #X]
4. If multiple articles contain relevant information, combine them logically
5. End with a list of referenced article numbers for traceability

If no relevant information is found, respond with:
"No relevant information found in the knowledge base for this query. Please try different search terms or contact support for assistance."

Response Format Example:
The MySQL JDBC connection error "Public Key Retrieval is not allowed" occurs when using the caching_sha2_password authentication plugin without SSL. [Article #2]

To resolve this issue, you can use any of these solutions:
1. Enable SSL for your connection [Article #2]
2. Create a user with mysql_native_password plugin [Article #2, #4]
3. Add useSSL=false&allowPublicKeyRetrieval=true to your JDBC URL. example: jdbc:mysql://localhost:3306/your_database_name?useSSL=false&allowPublicKeyRetrieval=true. [Article #2]

Referenced Articles: #2, #4
    
    
    `;
            // console.log({ prompt: prompt, results: await geminiService(prompt) });
            return await (0, gemini_1.default)(prompt);
        };
        const SolutionSummary = await getSummaryFromAI(uniqueEntries);
        // console.log(SolutionSummary)
        //ending gemini
        res.json({ results: uniqueEntries, SolutionSummary: SolutionSummary });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to search KB", traces: error });
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
        res.status(500).json({ error: "Failed to get KB", traces: error });
    }
}
