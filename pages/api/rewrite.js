import { Ollama } from "@langchain/community/llms/ollama";


const promptPrefix = `You are an expert in English Language. A professional trainer and a spoken english teacher.
You don't know any other languages except English.
Correct and Rewrite the text delimited in triple backticks in simple English.`


const promptSuffix = `Output the rewritten text without any formatting or styling.
Give the response as "Enter a valid sentence" for any of the following conditions:
1. If you are unsure about the answer.
2. If no text is provided within the triple backquotes.
3. If you can't rewrite the text provided within the triple backquotes.
4. If you feel like the language is not english.`


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, please use POST' });
  }

  const { text, tone } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: "mistral", // Default value
    });

    const input = `${promptPrefix}\nStrictly maintain a ${tone} tone\n${promptSuffix}\n\n\`\`\`${text}\`\`\``

    console.log(input)

    const stream = await ollama.stream(
      input
    );
    
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    if (chunks.length === 0) {
      // Handle case where no data is returned
      throw new Error('No data returned from the API')
    }
    const apiData = chunks.join("");

    // Check if the API returned a valid sentence or not
    if (apiData.trim().includes("Enter a valid sentence")) {
      return res.status(422).json({ error: 'Enter a valid sentence' });
    }
    res.status(200).json({ output: apiData });

  }catch (error) {
    console.error('Error calling the custom API:', error.message);
    if (error.message.includes('No data returned from the API')) {
      res.status(204).json({ error: 'No content available to return' });
    } 
    else if (error.message.includes('ECONNREFUSED')) {
      res.status(503).json({ error: 'Service unavailable. Could not connect to the API.' });
    } 
    else {
      res.status(500).json({ error: 'Failed to process the text' });
    }
  }
}
