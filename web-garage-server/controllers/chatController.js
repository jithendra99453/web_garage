// web-garage-server/controllers/chatController.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const NodeCache = require('node-cache');

// --- Caching Setup ---
// Create a new cache instance.
// stdTTL (Standard Time-To-Live): How long each cache entry lasts in seconds.
// 600 seconds = 10 minutes. After this, the cache for an entry expires.
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// --- Gemini API Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Pre-defined Greetings and Responses ---
const greetings = {
  "hi": "Hello! How can I help you learn about the environment today?",
  "hello": "Hi there! What environmental topic are you curious about?",
  "hey": "Hey! I'm EcoGuide, ready to answer your questions on sustainability.",
  "how are you": "I'm an AI, so I'm always running at 100%! What can I help you with?",
  "what is your name": "I'm EcoGuide, your friendly environmental education assistant."
};


exports.generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerCaseMessage = message.toLowerCase().trim();

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // --- Optimization Level 1: Handle Simple Greetings ---
    if (greetings[lowerCaseMessage]) {
      console.log('>>> Responding with a pre-defined greeting.');
      return res.json({ reply: greetings[lowerCaseMessage] });
    }

    // --- Optimization Level 2: Check the Cache ---
    if (myCache.has(lowerCaseMessage)) {
      console.log('>>> Responding from cache.');
      return res.json({ reply: myCache.get(lowerCaseMessage) });
    }

    // --- If not a greeting and not in cache, call the Gemini API ---
    console.log('>>> No greeting or cache hit. Calling Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are "EcoGuide", a helpful and friendly AI assistant for an environmental education platform.
    Your audience is students. Your goal is to answer their questions about ecology, conservation, climate change, recycling, sustainability, and related topics.
    Follow these rules:
    1.  Keep your answers clear, encouraging, and easy for a student to understand.
    2.  Use formatting like bullet points, bold text, and numbered lists to make the information easy to read.
    3.  If a question is outside the topic of environmental science, politely state that you can only answer questions about the environment.

    Here is the user's question: "${message}"`;    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // --- Store the new response in the cache before sending it back ---
    myCache.set(lowerCaseMessage, text);
    console.log('>>> Stored new response in cache.');

    res.json({ reply: text });

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'Failed to get a response.' });
  }
};
