import React, { useState } from "react";
import "./App.css"; // Stellt sicher, dass du deine App.css importierst

function App() {
  // Array für den Chat-Verlauf
  const [messages, setMessages] = useState([]);
  // Eingabefeld für die Frage
  const [question, setQuestion] = useState("");
  // Lade-Status
  const [loading, setLoading] = useState(false);

  // Senden-Handler
  const handleSubmit = async () => {
    // Leere Eingaben verhindern
    if (!question.trim()) return;
    setLoading(true);

    // 1) Nachricht des Nutzers in den State
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question }
    ]);

    try {
      // 2) Anfrage ans Backend
      const response = await fetch("http://localhost:8000/ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }),
      });
      const data = await response.json();

      // Die KI-Antwort steht i. d. R. in data.response
      // (z. B. "Hallo! Wie kann ich dir heute helfen?")
      const botReply = data.response || "Keine Antwort";

      // 3) Antwort des Bots in den State
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: botReply }
      ]);
    } catch (error) {
      console.error("Fehler bei der Anfrage:", error);
      // Fehlermeldung als Bot-Nachricht anzeigen
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Fehler bei der Anfrage: " + error.message
        }
      ]);
    }

    // Eingabe zurücksetzen
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="chat-container light">
      {/* Header-Bereich */}
      <header className="chat-header">
        <h2>Ollama Chat</h2>
        {/* Beispiel: Du könntest hier noch Buttons o. Ä. einbauen */}
      </header>

      {/* Chat-Verlauf */}
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

      {/* Eingabefeld und Button */}
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

