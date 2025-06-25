import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CListGroup,
  CListGroupItem,
  CContainer,
  CRow,
  CCol,
  CSpinner
} from "@coreui/react";

type ChatMessage = {
  role: 'user' | 'assistant';
  message: string;
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const clientId = "1";

  const sendMessage = async () => {    
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, message: input }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: clientId, messages: newMessages })
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', message: data.message }]);
    } catch (err) {
      console.error('Chyba pri načítaní odpovede:', err);
      setMessages([...newMessages, { role: 'assistant', message: '⚠️ Chyba pri načítaní odpovede.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const chatBox = document.querySelector(".chat-container");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  return (
    <CCard className="shadow-sm w-100" style={{ maxWidth: "800px", margin: "auto" }}>
      <CCardHeader className="centered-header">Boteva - Osobný bankový asistent</CCardHeader>
      <CCardBody>
        <div className="chat-container">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role === "user" ? "chat-user" : "chat-assistant"}`}
            >
              <strong>{msg.role === "user" ? "Vy" : "Asistent"}:</strong> {msg.message}
            </div>
          ))}
          {loading && (
            <div className="chat-message chat-assistant">
              <CSpinner size="sm" className="me-2"  aria-label=" "/> Načítavam odpoveď...
            </div>
          )}
        </div>

        <CForm className="d-flex align-items-center mt-3" onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}>
          <input
            type="text"
            placeholder="Napíšte správu..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '80%', 
              flex: 1,
              border: "none",
              borderBottom: "1px solid #ccc",
              outline: "none",
              padding: "8px 4px",
              fontSize: "1rem",
              backgroundColor: "transparent"
            }}
          />
          <CButton type="submit" style={{ marginLeft: "20px", padding: "5px 20px 5px 20px" }}>
            Poslať
          </CButton>
        </CForm>      
      </CCardBody>

      <style>{`
        .centered-header {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          padding-bottom: 2rem;
        }
        .chat-container {
          max-height: 400px;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .chat-message {
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 75%;
          word-wrap: break-word;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .chat-user {
          align-self: flex-end;
          background-color: #e0f7fa;
          color: #004d40;
        }
        .chat-assistant {
          align-self: flex-start;
          background-color: #f1f8e9;
          color: #33691e;
        }
        .spinner-border > .visually-hidden {
          display: none !important;
        }
      `}</style>
    </CCard>
  );

};

export default ChatPage;
