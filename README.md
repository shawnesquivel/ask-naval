# Ask-Naval

Ask-Naval is a web application built with Next.js, LangChain, and Pinecone. It makes use of Natural Language Processing (NLP) to enable users to ask questions and receive answers based on the contents of a book. In our case, we've used the book by Naval Ravikant. 

## Using the app

Remember to create a .env file in the root directory and fill it with necessary environment variables such as PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX, and OPENAI_API_KEY.

Enjoy interacting with the wisdom of Naval Ravikant!

## Features

- **Document Loader**: This component of our application reads a PDF file, in this case, a book, and converts each page into a `Document` object. Each `Document` contains the text content and metadata about the page.
- **LangChain**: This is a library developed by OpenAI that helps us process the unstructured text data from our documents. With LangChain, we can split our documents into smaller chunks, making it easier to process them using OpenAI's language model, GPT-4.
- **Pinecone**: Pinecone is a vector database that lets us store and search for similar items. In our case, we use it to store document vectors and perform efficient similarity searches to find relevant documents based on user queries.
- **Next.js**: Our application is built on top of Next.js, a popular React framework that allows for efficient server-side rendering and overall improved performance.

## How it Works

1. **Load and Process Documents**: The application starts by loading the book using a `PDFLoader`. The book is then split into smaller chunks using a `CharacterTextSplitter`. This makes the book easier to process.

2. **Create Vector Store**: Each document chunk is then converted into a vector using OpenAI's embeddings and stored in a Pinecone vector store.

3. **Query Processing**: When a user asks a question, the application searches the vector store for similar document vectors (i.e., documents that might contain the answer). The top documents are then processed using the OpenAI language model to generate the most relevant answer.

## Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/ask-naval.git

# Move into the directory
cd ask-naval

# Install dependencies
npm install

# Start the server
npm run dev
