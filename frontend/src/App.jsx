import React, { useState, useEffect, useRef } from "react";
import Spinner from "./Spinner";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    console.log("Aktuelle Nachrichten:", JSON.stringify(messages, null, 2));
  }, [messages]);
  
  
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatMessagesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
        setShowScrollButton(scrollTop + clientHeight < scrollHeight - 10);
      }
    };

    chatMessagesRef.current?.addEventListener("scroll", handleScroll);
    return () => chatMessagesRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async () => {
    if (!question.trim() && selectedFiles.length === 0) return;
    setLoading(true);
    setUploadStatus("");

    setMessages((prev) => [...prev, { role: "user", content: question }]);

    const formData = new FormData();
    formData.append("question", question);
    formData.append("model", "deepseek-r1:7b");

    if (selectedFiles.length > 0) {
      formData.append("file", selectedFiles[0]);
    }

    try {
      const response = await fetch("http://localhost:8000/ollama", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      let botReply = data.response || "Keine Antwort";

      // **Think-Tag erkennen und umwandeln**
      if (botReply.includes("<think>")) {
        const thinkContent = botReply.match(/<think>(.*?)<\/think>/s);
        if (thinkContent) {
          const cleanedThinkText = thinkContent[1].trim();
          botReply = botReply.replace(
            /<think>(.*?)<\/think>/gs,
            `<div class="think-bubble"><p>${cleanedThinkText}</p></div>`
          );
        }
      }

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Fehler bei der Anfrage:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Fehler: " + error.message }]);
    }

    setQuestion("");
    setSelectedFiles([]);
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1 className="chat-title">⚡ EchoCore ⚡</h1>
      </header>

      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === "user" ? "user" : "bot"}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
          </div>
        ))}
        {loading && <Spinner />}
        <div ref={messagesEndRef} />
        {showScrollButton && (
          <button className="scroll-to-bottom" onClick={scrollToBottom}>
            ⬇
          </button>
        )}
      </div>

      <div className="chat-input">
        <textarea
          rows="2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Deine Frage eintippen ..."
          disabled={loading}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setSelectedFiles([...e.target.files])}
          className="file-upload"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Wird geladen..." : "Senden"}
        </button>
      </div>
      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
    </div>
  );
}

export default App;
