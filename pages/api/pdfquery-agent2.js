import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { SerpAPI, ChainTool } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";

// https://js.langchain.com/docs/modules/agents/tools/agents_with_vectorstores

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
    const model = new OpenAI({ temperature: 0 });

    const chain = VectorDBQAChain.fromLLM(model, vectorStore);

    const qaTool = new ChainTool({
      name: "Naval Book",
      description: "useful for when you need to answer questions about Naval",
      chain: chain,
      returnDirect: true,
    });

    const tools = [
      new SerpAPI(process.env.SERPAPI_API_KEY, {
        location: "Vancouver,British Columbia, Canada",
        hl: "en",
        gl: "us",
      }),
      new Calculator(),
      qaTool,
    ];

    /* Create the agent */

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
      verbose: true,
    });

    console.log(`Executing: ${input}`);
    const result = await executor.call({ input });

    console.log(`Got output ${result.output}`);

    return res.status(200).json({ result: result });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
