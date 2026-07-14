import express from "express";
import dotenv from "dotenv";
import fs from "fs";

import { ChatGroq } from "@langchain/groq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 5000;

// ---------------- LLM ----------------

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// ---------------- Embeddings ----------------

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",
});

// ---------------- Upload PDF ----------------

async function uploadPDF() {
  const loader = new PDFLoader("./knowledge.pdf");

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing",
  });

  console.log("PDF Uploaded Successfully");
}

// ---------------- Existing Collection ----------------

const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddings,
  {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing",
  }
);

// ---------------- AI Route ----------------

app.post("/ai", async (req, res) => {
  try {
    const { input } = req.body;

    const docs = await vectorStore.similaritySearch(input, 3);

    const context = docs.map((d) => d.pageContent).join("\n\n");

    const response = await llm.invoke(`
Context:
${context}

Question:
${input}

Answer only from the context.
If answer is not present say "I don't know".
`);

    res.json({
      ai: response.content,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ---------------- Upload Route ----------------

app.get("/upload", async (req, res) => {
  await uploadPDF();
  res.json({
    message: "PDF Uploaded"
  });
});

// ---------------- Home ----------------

app.get("/", (req, res) => {
  res.json({
    message: "RAG Running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});