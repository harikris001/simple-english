import { Ollama } from "@langchain/community/llms/ollama";


const promptPrefix = `Correct and Rewrite the text delimited in triple backticks in simple English.
Output ONLY the rewritten text.`


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, please use POST' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: "mistral", // Default value
    });
    
    const stream = await ollama.stream(
      `${promptPrefix} \`\`\`${text}\`\`\``
    );
    
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    if (chunks.length === 0) {
      // Handle case where no data is returned
      throw new Error('No data returned from the API');
    }
    const apiData = chunks.join("");
    console.log(apiData);


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
