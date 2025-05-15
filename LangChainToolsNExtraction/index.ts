//import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {config} from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

config();

// const multiply = tool(
//   ({ a, b }: { a: number; b: number }): number => {
//     /**
//      * Multiply two numbers.
//      */
//     return a * b;
//   },
//   {
//     name: "multiply",
//     description: "Multiply two numbers",
//     schema: z.object({
//       a: z.number(),
//       b: z.number(),
//     }),
//   }
// );

// console.log(await multiply.invoke({ a: 2, b: 3 }));
// console.log(multiply.name);
// console.log(multiply.description);

const person = z.object({
  name: z.optional(z.string()).describe("The name of the person"),
  hair_color: z.optional(z.string()).describe("The hair color of the person if known"),
  height_in_meters: z.optional(z.number()).describe("The height of the person in meters"),
})

const dataSchema = z.object({
  people: z.array(person).describe("Extracted data about people"),
})
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert extraction algorithm.
Only extract relevant information from the text.
If you do not know the value of an attribute asked to extract,
return null for the attribute's value.`,
  ],
  ["human", "{text}"],
]);


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

const structured_llm = llm.withStructuredOutput(person);
const prompt = await promptTemplate.invoke({
  text: "Alan Smith is 6 feet tall and has blond hair.",
});
console.log(await structured_llm.invoke(prompt));


const structured_llm3 = llm.withStructuredOutput(dataSchema);
const prompt3 = await promptTemplate.invoke({
  text: "My name is Jeff, my hair is black and i am 6 feet tall.Anna has same hair color as mine.",
});
console.log(await structured_llm3.invoke(prompt3));