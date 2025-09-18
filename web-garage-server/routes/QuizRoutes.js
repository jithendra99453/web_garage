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
router.get('/generate', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
      Generate a list of 10 multiple-choice quiz questions about environmental science and sustainability for students. The questions should be unique, engaging, and of varying difficulty. Provide the output ONLY in a valid JSON array format. Do not include any other text, comments, or markdown formatting. Each object in the array must have this exact structure:
    {
    "question": "The question text.",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": (a zero-based index, e.g., 0 for Option A),
    "explanation": "A brief and interesting explanation for the correct answer."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // The model should return clean JSON, but we'll trim just in case.
    const cleanedText = text.trim();

    // Validate that the response is parseable JSON
    let questions;
    try {
        questions = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error('Failed to parse JSON from Gemini response:', parseError);
        console.error('--- Raw Gemini Response ---');
        console.error(text); // Log the raw text to see what Gemini sent
        console.error('---------------------------');
        // Throw a specific error if parsing fails
        throw new Error('The AI model returned a response that was not valid JSON.');
    }

    res.status(200).json(questions);

  } catch (error) {
    // Log the specific error message for better debugging
    console.error('Error generating quiz questions:', error.message);
    res.status(500).json({ message: 'Failed to generate quiz questions.' });
  }
});

module.exports = router;