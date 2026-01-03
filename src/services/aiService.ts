import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const aiService = {
    async generateBlog(topic: string) {
        if (!API_KEY) throw new Error("Gemini API Key missing");

        const modelsToTry = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];
        let lastError;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to generate with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                    Act as an expert Unani Medicine hakim/doctor.
                    Write a detailed blog post strictly focused on the topic: "${topic}".
                    
                    Important Guidelines:
                    1. Content must be 100% relevant to "${topic}".
                    2. Do not write about unrelated herbs or treatments.
                    3. Maintain a professional yet accessible tone suited for a health blog.
                    
                    Format the response as a JSON object with these keys:
                    - title: A catchy, professional title.
                    - excerpt: A short summary (2 sentences).
                    - content: The full blog post in markdown format. detailed, informative, include headers.
                    - image_prompt: A photograph description of "${topic}". High quality, realistic, nutritional or medical context.
                    
                    JSON:
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Cleanup markdown json blocks if present
                const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanedText);

            } catch (error: any) {
                console.error(`Failed with model ${modelName}:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        // If all failed
        if (lastError) {
            console.error("All models failed.");
            if (lastError.message.includes("404") || lastError.message.includes("not found")) {
                throw new Error(`AI Models not accessible. Ensure Gemini API is enabled in Google Cloud Console.`);
            }
            throw lastError;
        }
    },

    async generateImageUrl(prompt: string) {
        try {
            // Attempt 1: Google Imagen via SDK (generateContent)
            // This is the clean way if supported by the library/model mapping.
            const imagenModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

            // Imagen prompt structure for generateContent might be just text string or parts
            await imagenModel.generateContent(prompt);
            // const response = await result.response;

            // Check for inline data (base64)
            // SDK usually doesn't return 'text()' for images.
            // We need to inspect candidates. 
            // Note: The JS SDK typings/implementation details for Imagen are sparse.
            // If this throws/fails, we catch and fallback.

            /* 
               Since SDK usage for Imagen is experimental/undocumented in this version,
               and previous REST failed with 404 on 'predict',
               it's safer to bet on the Pollinations fix first for immediate stability,
               or try the REST API on 'generateContent' path if we really want Imagen.
            */
        } catch (e) {
            console.error("Imagen SDK attempt failed:", e);
        }

        // Fallback: Pollinations with .jpg extension to force image response
        // This fixes the "Text/HTML" response issue.
        const seed = Math.floor(Math.random() * 10000);
        const encodedPrompt = encodeURIComponent(prompt + " realistic high quality health medical");

        // Adding .jpg is often the trick for these "viewer" vs "raw" URLs
        return `https://pollinations.ai/p/${encodedPrompt}.jpg?seed=${seed}&width=1024&height=768&nologo=true`;
    }
};
