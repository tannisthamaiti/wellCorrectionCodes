import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [fileTypes, setFileTypes] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const handleShowMap = () => {
  navigate("/well-map");
};
const handleAskImage = () => navigate("/ask-image");  // ✅ navigate to new page

  const ws = useRef(null);  // ✅ websocket reference

  // Load file types and connect websocket
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      setFileTypes(parsedFiles);

      const fileNameToSend = parsedFiles.files?.[0] || "Well data.CSV";

      // Connect WebSocket
      ws.current = new WebSocket('ws://165.22.228.32:8000/ws');

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        ws.current.send(fileNameToSend);  // ✅ send file name instead of folder
        addBotMessage(`Chat with data`);
      };

      ws.current.onmessage = (event) => {
        console.log('💬 Message from backend:', event.data);
        addBotMessage(event.data);
      };

      ws.current.onclose = () => {
        console.log('❌ WebSocket closed');
        addBotMessage('❌ Connection closed');
      };
    }
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const addBotMessage = (text) => {
    setChatMessages((prev) => [...prev, { sender: 'bot', text }]);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(userInput);
      console.log('📤 Sent user message:', userInput);
    } else {
      addBotMessage('⚠️ WebSocket is not connected.');
    }

    setUserInput('');
  };

  const handleShowVideo = async () => {
    if (videoPath) {
      setVideoPath(null);
    } else {
      const response = await fetch('http://localhost:5000/generate');
      const data = await response.json();
      setVideoPath(`http://localhost:5000${data.video_path}`);
    }
  };

  return (
    <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem' }}>
      <h1>File Summary and Mapping of Wells</h1>

      {/* ✅ ✅ FILE TYPES SUMMARY CARD (original behavior) */}
      <div className="file-summary-card" style={{ padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>File Summary</h3>
        {Object.keys(fileTypes).length > 0 ? (
          <div className="file-type-grid" style={{ display: 'flex', gap: '1rem' }}>
            {Object.entries(fileTypes).map(([type, count]) => (
              <div key={type} className="file-type-card" style={{ textAlign: 'center', fontSize: '0.9rem', border: '1px solid #ccc', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{type.toUpperCase()}</div>
                <div>{count} {count === 1 ? 'file' : 'files'}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      {/* Chatbot Section */}
      <div className="chatbot-section" style={{ flexGrow: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: '#fff', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3>Chat Assistant for Earthscan</h3>
        <div className="chat-window" style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '0.5rem', border: '1px solid #eee', padding: '0.5rem', borderRadius: '4px', background: '#fafafa' }}>
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '0.3rem 0' }}>
                <div style={{ display: 'inline-block', padding: '0.4rem 0.8rem', background: msg.sender === 'user' ? '#dcf8c6' : '#eee', borderRadius: '12px' }}>
                  {msg.text}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>Say hello to start chatting...</p>
          )}
        </div>
        <div className="chat-input" style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSendMessage} style={{ padding: '0.5rem 1rem' }}>Send</button>
        </div>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <h3>Recent Activity</h3>
        <p>Your files are being processed and analyzed.</p>
        <button onClick={handleShowMap}>
         Show Map
        </button>
        {/* {videoPath && (
          <div style={{ marginTop: '1rem' }}>
            <video width="400" controls>
              <source src={videoPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )} */}
        <div>
        <button
          onClick={() => window.open("/digital-twin", "_blank")}
          style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#1976d2", color: "white", border: "none", borderRadius: "4px" }}
        >
          Open Well Visualizer
    </button>
    </div>
    <div>
          <button
            onClick={handleAskImage}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#2e7d32", color: "white", border: "none", borderRadius: "4px" }}
          >
            Ask Question About Image
          </button>
        </div>
      </div>
    </div>
  );
}
