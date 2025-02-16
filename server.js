const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_KEY;

console.log("API Key from env:", GEMINI_KEY);
if (!GEMINI_KEY) {
    console.error("Error: GEMINI_KEY is not defined in .env file");
    process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-cv', async (req, res) => {
    const { promptText } = req.body;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Fetch error: ", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});