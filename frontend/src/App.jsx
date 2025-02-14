import React, { useState } from "react";
import Spinner from "./Spinner"; // importiere den Spinner
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const response = await fetch("http://localhost:8000/ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      const botReply = data.response || "Keine Antwort";

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Fehler bei der Anfrage:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Fehler bei der Anfrage: " + error.message },
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="chat-container light">
      <header className="chat-header">
        <h2>Ollama Chat</h2>
        {/* Zeige Spinner nur, wenn loading true */}
        {loading && <Spinner />}
      </header>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          rows="2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Deine Frage eintippen ..."
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Wird geladen..." : "Senden"}
        </button>
      </div>
    </div>
  );
}

export default App;