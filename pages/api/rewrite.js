
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, please use POST' });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const apiResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistral",
        prompt: `Correct and rewrite in simple English: ${text}`
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(`API responded with status code ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();
    const rewrittenText = apiData.text;
    console.log(rewrittenText)
    res.status(200).json({ rewrittenText });
  } catch (error) {
    console.error('Error calling the custom API:', error);
    res.status(500).json({ error: 'Failed to process the text' });
  }
}
