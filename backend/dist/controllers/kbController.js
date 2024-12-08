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
            //       const prompt = `
            //     You are a technical support assistant helping users find solutions from our knowledge base. For the search query "${query}", analyze these knowledge base articles: ${JSON.stringify(
            //         entries
            //       )}
            // If relevant information is found:
            // 1. Provide a clear, direct solution starting with the problem statement
            // 2. List all required steps or solutions
            // 3. For each major point, reference the source article number [Article #X]
            // 4. If multiple articles contain relevant information, combine them logically
            // 5. End with a list of referenced article numbers for traceability
            // If no relevant information is found, respond with:
            // "No relevant information found in the knowledge base for this query. Please try different search terms or contact support for assistance."
            // Response Format Example:
            // The MySQL JDBC connection error "Public Key Retrieval is not allowed" occurs when using the caching_sha2_password authentication plugin without SSL. [Article #2]
            // To resolve this issue, you can use any of these solutions:
            // 1. Enable SSL for your connection [Article #2]
            // 2. Create a user with mysql_native_password plugin [Article #2, #4]
            // 3. Add useSSL=false&allowPublicKeyRetrieval=true to your JDBC URL. example: jdbc:mysql://localhost:3306/your_database_name?useSSL=false&allowPublicKeyRetrieval=true. [Article #2]
            // Referenced Articles: #2, #4
            //     `;
            const prompt = `



You are a technical support assistant helping users find solutions from our knowledge base. For the search query "${query}", analyze these knowledge base articles: ${JSON.stringify(entries)}

If relevant information is found:
1. Format your response in HTML with appropriate styling
2. Use tables, lists, or cards where they improve readability
3. Highlight important warnings or notes
4. Preserve any code blocks exactly as they appear
5. Reference source articles inline
6. End with a "Referenced Articles" section

If no relevant information is found, respond with:
"<div class='error-message'>No relevant information found in the knowledge base for this query. Please try different search terms or contact support for assistance.</div>"

Response Format Example:
<div class="kb-article">
    <h2>Installing Layer7 API Gateway License</h2>
    
    <div class="prerequisites">
        <strong>Prerequisites:</strong> Obtain the license file from the CA Customer Care License team
    </div>

    <div class="steps">
        <h3>Installation Steps:</h3>
        <ol>
            <li>
                <strong>Download and extract the license file:</strong>
                <div class="note">
                    The license file will have a *.LIC extension. Rename it to *.zip, extract the archive, and locate the 'license.xml' file.
                </div>
                <div class="warning">
                    Failure to do this will result in an error:
                    <pre class="error-code">Unable to read license file: "The specified license file is not well-formatted XML: Content is not allowed in prolog."</pre>
                </div>
                <span class="reference">[Article #1]</span>
            </li>
            
            <li>
                <strong>Install the license:</strong>
                <div class="sub-steps">
                    <h4>For first-time installation:</h4>
                    <ol>
                        <li>Wait for the Gateway License warning dialog to appear</li>
                        <li>Click "Install License"</li>
                        <li>Navigate to and select the extracted 'license.xml' file</li>
                        <li>Click "Open"</li>
                        <li>Click "I Agree" to accept the license agreement</li>
                    </ol>
                    <span class="reference">[Article #1]</span>

                    <h4>To update an expired license:</h4>
                    <ol>
                        <li>Go to Help > Manage Gateway Licenses</li>
                        <li>Select the expired license</li>
                        <li>Click "Remove License"</li>
                        <li>Click "Yes" to access the license manager</li>
                        <li>Follow the same steps as first-time installation</li>
                    </ol>
                    <div class="note">Only install the newer version when the current license is about to expire.</div>
                    <span class="reference">[Article #1]</span>
                </div>
            </li>
        </ol>
    </div>

    <div class="referenced-articles">
        Referenced Articles: #1
    </div>
</div>

<style>
.kb-article {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.kb-article h2 {
    color: #2c3e50;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;
}

.prerequisites {
    background: #f8f9fa;
    padding: 15px;
    border-left: 4px solid #007bff;
    margin-bottom: 20px;
}

.note {
    background: #e1f5fe;
    padding: 12px;
    border-radius: 4px;
    margin: 10px 0;
}

.warning {
    background: #fff3e0;
    padding: 12px;
    border-radius: 4px;
    margin: 10px 0;
    border-left: 4px solid #ff9800;
}

.error-code {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
    margin: 10px 0;
}

.reference {
    color: #666;
    font-size: 0.9em;
}

.referenced-articles {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    color: #666;
}

.error-message {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 15px;
    border-radius: 4px;
    margin: 20px 0;
}

.sub-steps {
    margin-left: 20px;
    margin-top: 10px;
}

.sub-steps h4 {
    margin: 15px 0 10px 0;
    color: #34495e;
}

code {
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
}
</style>




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
