import express from "express";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

dotenv.config();

const app = express();
app.use(express.json());

// --------------------
// Tavily Tool
// --------------------
const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

const tools = [tool];
const toolNode = new ToolNode(tools);

// --------------------
// Gemini LLM
// --------------------
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 1,
  maxOutputTokens: 100,
  maxRetries: 2,
}).bindTools(tools);

// --------------------
// LLM Node
// --------------------
const callLLM = async (state) => {
  console.log("State:", state);

  const response = await llm.invoke([
    {
      role: "system",
      content: `
You are DOPE.

If the user asks about
- weather
- news
- current events
- sports
- stock prices
- live information
- today's information
- latest information

ALWAYS call the search tool before answering.

Never answer "I don't know" without first checking the search tool.
`,
    },
    ...state.messages,
  ]);

  return {messages: [response]};
};

// --------------------
// Conditional Edge
// --------------------
const shouldContinue = (state) => {
  const lastMessage = state.messages[state.messages.length - 1];

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
};

// --------------------
// Graph
// --------------------
const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile();

// --------------------
// API
// --------------------
app.post("/ai", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "Input is required",
      });
    }

    const result = await graph.invoke({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    console.log(result.messages);

    const lastMessage =
      result.messages[result.messages.length - 1];

    return res.status(200).json({
      ai: lastMessage.content,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

// --------------------
// Home
// --------------------
app.get("/", (req, res) => {
  res.json({
    message: "LangGraph + Gemini + Tavily Running ",
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});