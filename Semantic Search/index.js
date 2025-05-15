import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf"
//import {Document} from "@langchain/core/documents"
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters"
import { VertexAIEmbeddings } from "@langchain/google-vertexai"
import {MemoryVectorStore} from "langchain/vectorstores/memory"
import dotenv from "dotenv";

dotenv.config();

const embeddings = new VertexAIEmbeddings({
  modelName: "text-embedding-005", // Or your desired model
  projectId: process.env.GOOGLE_CLOUD_PROJECT, // Ensure this is set in .env
});

// const documents = [
//     new Document({
//         pageContent: 
//             "Dogs are great companion known for their loyalty",
//             metadata:{ source: "mammal-pets-doc" }
//     }),
//     new Document({
//         pageContent: 
//             "Cats are independent pets that often enjoy",
//             metadata:{ source: "mammal-pets-doc" }
//     })
// ]

const text = "LangChain is the framework for building context-aware reasoning applications."
const text2 =
  "LangGraph is a library for building stateful, multi-actor applications with LLMs";

const vectors = await embeddings.embedDocuments([text, text2]);
const vectorstore = await MemoryVectorStore.fromDocuments([{pageContent: text, metadata: {} }], embeddings);

const retriever = vectorstore.asRetriever(1);

const retrievedDocuments = await retriever.invoke("What is LangChain?");

console.log(retrievedDocuments[0].pageContent) 

const singleVector = await embeddings.embedQuery(text);

//console.log(singleVector.slice(0, 100));

// console.log(vectors[0].slice(0, 100));
// console.log(vectors[1].slice(0, 100));

// const loader = new PDFLoader("/Users/shamalamallya/Learning/LangChain/Semantic Search/data/nke-10k-2023.pdf")
// const docs = await loader.load()
// const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 200,
// })
// const allSplits =  await textSplitter.splitDocuments(docs)

// const vector1 = await embeddings.embedQuery(allSplits[0].pageContent)
// const vector2 = await embeddings.embedQuery(allSplits[1].pageContent)


// console.assert(vector1.length === vector2.length);
// console.log(`Generated vectors of length ${vector1.length}\n`);
// console.log(vector1.slice(0, 10));
// console.log(allSplits.length)

// console.log(docs.length)

// console.log(docs[0].pageContent.slice(0,200)) 
// console.log(docs[0].metadata) 