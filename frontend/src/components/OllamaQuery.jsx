// frontend/src/components/OllamaQuery.jsx
import React, { useState } from 'react';

const OllamaQuery = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer || JSON.stringify(data));
    } catch (error) {
      console.error('Fehler bei der Anfrage:', error);
      setAnswer('Ein Fehler ist aufgetreten.');
    }
  };

  return (
    <div>
      <h2>Ollama Query</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Gib deine Frage ein..."
        rows={4}
        style={{ width: '100%' }}
      />
      <button onClick={handleSubmit}>Frage senden</button>
      <h3>Antwort:</h3>
      <pre>{answer}</pre>
    </div>
  );
};

export default OllamaQuery;
