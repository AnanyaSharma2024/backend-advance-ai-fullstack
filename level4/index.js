import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { ChatGoogleGenerativeAI} from '@langchain/google-genai';

dotenv.config();
const app = express();
const port = 5000;
app.use(express.json());

// W I T H O U T - L A N G C H A I N

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// app.post("/ai", async (req, res) => {
//   const {input} = req.body;
//   const response = await ai.models.generateContent({
//     model: 'gemini-3.5-flash',
//     contents: [
//       {
//         role: 'system', 
//         parts: [{
//           type: 'text',
//           text: 'You are a helpful assistant and your name is DOPE. if you dont know the answer do not give the incorrect answer. if you dont know the answer say "I dont know"'
//         }]
//         },
//         {
//           role: 'user',
//           parts: [{
//             type: 'text', 
//             text: input
//           }] 
//         }
//     ]
//   });
//   return res.json({ output: response });
// });

// W I T H  - L A N G C H A I N

const llm = new ChatGoogleGenerativeAI({
  model:"gemini-3.5-flash",
  temperature:1, // inc temp pr creative ho jata h default 0.7 hota h
  maxOutputTokens:100,
  maxRetries:2
});

app.post("/ai", async (req, res) => {
  const { input } = req.body;

  const response = await llm.invoke([
    {
      role: "system",
      parts: [
        {
          type: "text",
          text: `You are a helpful assistant and your name is DOPE.
If you don't know the answer, do not make up an answer.
Simply reply: "I don't know".`,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          type: "text",
          text: input,
        },
      ],
    },
  ]);

  return res.json({
    ai: response.content,
  });
});
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});