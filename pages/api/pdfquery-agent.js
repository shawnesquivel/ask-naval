import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import {
  VectorStoreToolkit,
  createVectorStoreAgent,
  VectorStoreInfo,
} from "langchain/agents";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Query PDF");

    // Grab the user prompt
    const input = req.body.input;

    if (!input) {
      console.log("no input");
      return;
    } else {
      console.log("input received:", input);
    }
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );

    /* Create the agent */
    const vectorStoreInfo = {
      name: "Naval Book",
      description: "philosophy for building wealth and being happy",
      vectorStore,
    };
    const model = new OpenAI({ temperature: 0 });

    const toolkit = new VectorStoreToolkit(vectorStoreInfo, model);
    const agent = createVectorStoreAgent(model, toolkit);

    console.log(`Executing: ${input}`);
    const result = await agent.call({ input });

    console.log(`Got output ${result.output}`);
    console.log(
      `Got intermediate steps ${JSON.stringify(
        result.intermediateSteps,
        null,
        2
      )}`
    );

    return res.status(200).json({ result: result });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
