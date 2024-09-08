const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express()

app.use(cors(
    {
        origin: [`${process.env.FRONTEND_URL}`],
        methods: ["POST", "GET"],
        credentials: true
    }
))
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY)

app.get("/", (req, res) => {
    res.json("It is working")
})

app.post('/gemini', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const chat = model.startChat({
        history: req.body.history, 
    })

    const msg = req.body.message 

    const result = await chat.sendMessage(msg)
    const response = await result.response
    const text = await response.text()
    res.send(text)
})

app.listen(process.env.PORT, () => console.log(`listening to port ${process.env.PORT}`))
 