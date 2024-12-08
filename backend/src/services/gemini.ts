import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const geminiService = async (prompt: string): Promise<string> => {
    const result = await model.generateContent(prompt);
    return result.response.text();
};

export default geminiService ;
