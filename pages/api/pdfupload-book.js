import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Uploading book");
    // Enter your code here
    /** STEP ONE: LOAD DOCUMENT */
    const bookPath =
      "/Users/shawnesquivel/GitHub/yt-script-generator/data/document_loaders/naval-ravikant-book.pdf";
    const loader = new PDFLoader(bookPath);

    const docs = await loader.load();

    if (docs.length === 0) {
      console.log("No documents found.");
      return;
    }

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    // Reduce the size of the metadata for each document -- lots of useless pdf information
    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf; // Remove the 'pdf' field
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });

    console.log(docs[100]);
    console.log(splitDocs[100].metadata);
    console.log(reducedDocs[100].metadata);

    /** STEP TWO: UPLOAD TO DATABASE */

    const client = new PineconeClient();

    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
      pineconeIndex,
    });

    console.log("Successfully uploaded to DB");
    // Modify output as needed
    return res.status(200).json({
      result: `Uploaded to Pinecone! Before splitting: ${docs.length}, After splitting: ${splitDocs.length}`,
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
