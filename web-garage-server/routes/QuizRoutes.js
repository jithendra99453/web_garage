const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- API Key Check ---
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables.');
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   GET /api/quiz/generate
// @desc    Generate a new set of quiz questions using Gemini
// ... imports and setup remain the same ...

router.get('/generate', async (req, res) => {
  let rawText = ''; // Define rawText here to access it in the catch block
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
        Generate a list of 10 UNIQUE multiple-choice quiz questions about environmental science and sustainability. 

        Requirements:
        1. Questions should vary in difficulty (easy, medium, hard).
        2. Cover a broad range of topics such as: climate change, renewable energy, waste management, biodiversity, water conservation, sustainable agriculture, pollution, green technologies, and environmental policies.
        3. Do NOT repeat the same question or wording in different runs.
        4. Avoid overly generic questions; make them context-based or scenario-driven where possible.
        5. Randomize the order of correct answers (not always the first option).

        Provide the output ONLY in a valid JSON array format.
        Each object MUST strictly follow this structure:
        {
          "question": "The question text.",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": (a zero-based index of the correct answer, e.g., 0, 1, 2, or 3),
          "explanation": "A brief and interesting explanation or tip for why the answer is correct."
        }
      `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    rawText = await response.text();

    console.log("--- Raw Gemini Response ---");
    console.log(rawText);

    // --- AGGRESSIVE JSON EXTRACTION ---

    // 1. Find the first occurrence of '['
    const startIndex = rawText.indexOf('[');
    
    // 2. Find the last occurrence of ']'
    const endIndex = rawText.lastIndexOf(']');

    // 3. Check if we found a valid start and end
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      throw new Error("Could not find a valid JSON array (starting with '[' and ending with ']') in the response.");
    }

    // 4. Extract the substring that is likely our JSON
    const jsonString = rawText.substring(startIndex, endIndex + 1);

    // 5. Parse the extracted string
    const questions = JSON.parse(jsonString);
    
    res.status(200).json(questions);

  } catch (error) {
    console.error('Error generating quiz questions:', error.message);
    console.error('--- Failed Raw Text ---');
    console.error(rawText); // This will show us the exact text that caused the failure
    res.status(500).json({ message: 'Failed to generate and parse quiz questions.' });
  }
});

module.exports = router;
