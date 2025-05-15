import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY
});

const messages = [
    new SystemMessage("Translate the following from English to Italian"),
    new HumanMessage("Hi!"),
]

const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
])

const promptValue = await promptTemplate.invoke({
    language: "Spanish",
    text:"Hi!",
})


const response = await model.invoke(promptValue);
console.log(response);