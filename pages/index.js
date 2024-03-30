import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    console.log("Calling Mistral API...");
    
    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to rewrite text');
      }

      const data = await response.json();
      const { output } = data;
      // console.log(output)
      console.log("Mistral replied: ", output)
      setApiOutput(`${output}`);
    } 
    catch (error) { 
      console.error('Error from the CODE: ', error);
      setError('Failed to rewrite text. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '100vh', padding: '20px 0' }}>
  <h1 style={{ alignSelf: 'center', marginBottom: '20px' }}>Rewrite Your Message In Simple English</h1>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%' }}>
    <textarea
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      style={{ width: '300px', height: '100px', marginBottom: '20px' }}
      placeholder="Enter text here"
    />
    <button type="submit" style={{ position: 'absolute', right: '10px', bottom: '0', marginTop: '20px' }}>Submit</button>

    <div className="output-content" >
      <p>{apiOutput}</p>
    </div>
    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Displaying errors to the user */}
  </form>
</div>



  );
}
