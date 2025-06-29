import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AIChat() {
  const [messages, setMessages] = useState([{ role: 'ai', content: 'שלום! איך אוכל לעזור לך היום?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const LoadingDots = () => (
    <span className="loading-dots">
      <span>.</span><span>.</span><span>.</span>
    </span>
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput('');

    try {
      const res = await axios.post('/api/ai/chat', {
        messages: newMessages,
      });

      setMessages([...newMessages, { role: 'ai', content: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'ai', content: 'שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '900px' }}>
      <h2 className="text-center mb-4">Ollama</h2>

      <div
        className="border rounded p-3 mb-3"
        style={{
          height: '800px',
          overflowY: 'auto',
          background: '#f8f9fa',
          direction: 'rtl',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="d-flex flex-column"
            style={{
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', // ❗ כאן השינוי
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <strong className="mb-1">{msg.role === 'user' ? 'מנהל מערכת' : 'AI'}:</strong>
            <div
              style={{
                backgroundColor: msg.role === 'user' ? '#0d6efd' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: '10px 15px',
                borderRadius: '15px',
                maxWidth: '60%',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div
            className="d-flex flex-column"
            style={{ alignItems: 'flex-start', textAlign: 'left' }}
          >
            <strong className="mb-1">AI:</strong>
            <div
              style={{
                backgroundColor: '#e9ecef',
                color: 'black',
                padding: '10px 15px',
                borderRadius: '15px',
                maxWidth: '60%',
                fontWeight: 'bold',
                fontSize: '24px',
                userSelect: 'none',
              }}
            >
              <LoadingDots />
            </div>
          </div>
        )}

        {/* עוגן לגלילה אוטומטית לתחתית */}
        <div ref={messagesEndRef} />
      </div>

      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2 text-end"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הקלד שאלה"
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
          שלח
        </button>
      </div>

      {/* אנימציית שלוש נקודות */}
      <style>{`
        .loading-dots span {
          animation-name: blink;
          animation-duration: 1.4s;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          font-weight: bold;
          font-size: 24px;
          color: #6c757d;
          margin-right: 2px;
        }
        .loading-dots span:nth-child(1) {
          animation-delay: 0s;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
