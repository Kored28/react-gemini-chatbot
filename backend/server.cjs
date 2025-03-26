const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenAI  } = require("@google/genai");

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express()

app.use(cors({ origin: "*", methods: "GET,POST", allowedHeaders: "Content-Type" }));
app.use(express.json())
app.options('*', cors());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY)

app.get("/", (req, res) => {
    res.json("It is working")
})

app.post('/gemini', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const chatHistory = req.body.history || [];
        const userMessage = req.body.message;

        // Append the new user message to the chat history
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        const result = await model.generateContent({
            contents: chatHistory
        });

        const response = await result.response;
        const modelReply = response.candidates[0].content.parts[0].text;

        // Append the model's reply to the chat history
        chatHistory.push({ role: "model", parts: [{ text: modelReply }] });

        res.json({ reply: modelReply, history: chatHistory });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(process.env.PORT, () => console.log(`listening to port ${process.env.PORT}`))
 
