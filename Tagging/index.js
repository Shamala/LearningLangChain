import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatPromptTemplate} from "@langchain/core/prompts"
import { z }  from "zod";
import dotenv from "dotenv";

dotenv.config();
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY
});

const taggingPrompt = ChatPromptTemplate.fromTemplate(
    `Extract the desired information from the following passage.
    
    Only extract the properties mentioned in the 'Classification' function.
    
    Passage:
    {input}
    `
);

const classificationSchema = z.object({
    sentiment: z.string().describe("The sentiment of the text"),
    aggressiveness: z.number().int().describe("How aggressive the text is from scale of 1 to 10"),
    language: z.string().describe("The language the text is written in"),
});

const classificationSchema2 = z.object({
    sentiment: z.enum(["positive", "negative", "neutral"]).describe("The sentiment of the text"),
    aggressiveness: z.number().int().describe("How aggressive the text is from scale of 1 to 10"),
    language: z.enum(["English", "Spanish", "French", "German", "Italian"]).describe("The language the text is written in"),
});

const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema, {name: "extractor"});
const llmWithStructuredOutput2 = llm.withStructuredOutput(classificationSchema2, {name: "extractor"});

const prompt1 = await taggingPrompt.invoke({
    input: 
        "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!",
});
const response = await llmWithStructuredOutput.invoke(prompt1);
console.log(response)

const prompt2 = await taggingPrompt.invoke({
  input:
    "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!",
});
const response2 = await llmWithStructuredOutput2.invoke(prompt2);
console.log(response2)

const prompt3 = await taggingPrompt.invoke({
  input: "Estoy muy enojado con vos! Te voy a dar tu merecido!",
});
const response3 = await llmWithStructuredOutput2.invoke(prompt3);
console.log(response3)

const prompt4 = await taggingPrompt.invoke({
  input: "Weather is ok here, I can go outside without much more than a coat",
});
const response4 = await llmWithStructuredOutput2.invoke(prompt4);
console.log(response4)