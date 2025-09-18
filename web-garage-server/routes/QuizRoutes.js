const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   GET /api/quiz/generate
// @desc    Generate a new set of quiz questions using Gemini
router.get('/generate', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
      Generate a list of 10 multiple-choice quiz questions about environmental science and sustainability.
      The questions should be unique, engaging, and of varying difficulty.
      Provide the output ONLY in a valid JSON array format. Do not include any other text or markdown formatting.
      Each object in the array should have the following structure:
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

    // Clean the response text to ensure it's valid JSON
   // Correctly removes markdown code fences like ```json and ```
const jsonResponse = text.replace(/```json|```/g, '').trim();

    // Parse the JSON string into an object
    const questions = JSON.parse(jsonResponse);

    res.status(200).json(questions);

  } catch (error) {
    console.error('Error generating quiz questions:', error);
    res.status(500).json({ message: 'Failed to generate quiz questions.' });
  }
});

module.exports = router;
