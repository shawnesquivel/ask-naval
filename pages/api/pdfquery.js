import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

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

    /* Search the vector DB independently with meta filters */
    // const results = await vectorStore.similaritySearch("pinecone", 1, {
    //   foo: "bar",
    // });
    // console.log(results);
    /*
[
  Document {
        pageContent: 'pinecone is a vector db',
        metadata: { foo: 'bar' }
    }
    ]
    */

    /* Use as part of a chain (currently no metadata filters) */
    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 1,
      returnSourceDocuments: true,
    });
    const response = await chain.call({ query: input });
    console.log(response);
    /*
{
  text: ' A pinecone is the woody fruiting body of a pine tree.',
  sourceDocuments: [
    Document {
      pageContent: 'pinecones are the woody fruiting body and of a pine tree',
      metadata: [Object]
    }
    ]
    }
    */

    return res.status(200).json({ result: response });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
