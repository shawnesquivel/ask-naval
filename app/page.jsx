"use client";

import React, { useState } from "react";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
const PDFLoader = () => {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (endpoint) => {
    console.log(`sending ${prompt}`);
    console.log(`using ${endpoint}`);
    // STEP 1: Modify Endpoint

    /**
     * /pdfuploadtest
     * /pdfuploadpdf
     * /pdfuploaddirectory
     *
     */

    const response = await fetch(`/api/${endpoint}`, {
      // STEP 2: Check Method
      method: "GET",
    });

    const searchRes = await response.json();
    // Step 3: Double check the console log and setData accordingly
    console.log(searchRes);
    setData(searchRes.text);
  };
  const handleSubmitQuery = async (endpoint) => {
    console.log(`sending ${prompt}`);
    console.log(`endpoint: ${endpoint}`);
    // STEP 1: Modify Endpoint
    const response = await fetch(`/api/${endpoint}`, {
      // STEP 2: Check Method
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    const searchRes = await response.json();
    // Step 3: Double check the console log and setData accordingly
    console.log(searchRes);
    setData(searchRes.result);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Step 4: Change the UI as necessary! */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Ask Naval 🤔</h1>
      <p className="text-lg text-gray-700 mb-2">
        From The Almanack of Naval Ravikant
      </p>

      <div className="flex items-center mb-8 gap-10">
        <button
          onClick={() => handleSubmit("/pdfuploadtest")}
          className="py-2 px-6 mb-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Upload Test Data
        </button>
        <button
          onClick={() => handleSubmit("/pdfupload-book")}
          className="py-2 px-6 mb-4 bg-purple-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Upload Book 📚
        </button>
      </div>

      <div className="flex items-center mb-8 gap-10">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter prompt"
          className="w-full mr-4 py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />
        <button
          onClick={() => handleSubmitQuery("/pdfquery")}
          className="py-2 px-6 bg-green-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Ask
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {data && (
          <>
            <p className="text-gray-800 text-lg font-medium mb-4">
              {data?.text}
            </p>
            {data?.sourceDocuments &&
              data?.sourceDocuments.map((document, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-gray-600 text-sm font-bold">
                    Source {index + 1}:
                  </h3>
                  <p className="text-gray-800 text-sm mt-2">
                    {document.pageContent}
                  </p>
                  <pre className="text-xs text-gray-500 mt-2">
                    {JSON.stringify(document.metadata, null, 2)}
                  </pre>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PDFLoader;
