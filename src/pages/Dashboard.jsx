import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';


function formatTimestamped(message) {
  const now = new Date();
  return `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} - ${message}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const chatLogRef = useRef(null);

  const handleShowMap = () => navigate("/well-map");
  const handleAskImage = () => navigate("/ask-image");

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setChatHistory((prev) => [...prev, { sender: 'user', text: userInput }]);
    setUserInput('');
    try {
      const response = await fetch(`https://c465-5-178-113-239.ngrok-free.app/explain?prompt=${encodeURIComponent(userInput)}`);
      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: data.response || 'No answer returned.' },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: `Error: ${error.message}` },
      ]);
    }
  };

  const handleROICalculate = async () => {
  setShowProcessing(true);
  setPipelineLogs([
    formatTimestamped('Files uploaded to folder.'),
    formatTimestamped('Ingestion Agent triggered.'),
    formatTimestamped('Extracting Formation Tops...'),
  ]);

  try {
    const response = await fetch('https://c465-5-178-113-239.ngrok-free.app/merge-well-formation', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success') {
      setPipelineLogs(prev => [
        ...prev,
        formatTimestamped(`✅ Formation Tops extracted. Rows: ${data.rows}`),
        formatTimestamped(`📁 Output File: ${data.output}`),
      ]);
    } else {
      setPipelineLogs(prev => [
        ...prev,
        formatTimestamped(`API responded with status: ${data.status}`),
      ]);
    }
  } catch (error) {
    setPipelineLogs(prev => [
      ...prev,
      formatTimestamped(`API request failed: ${error.message}`),
    ]);
  }
};

  const handleProcessingComplete = (finalData) => {
    setProcessingResult(finalData);
    setShowProcessing(false);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f5f8fc', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 600 }}>
          File Summary and Mapping of Wells
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <h3>Data Processing Steps</h3>
            <p>Click the button to process the uploaded files.</p>
            <button
              onClick={handleROICalculate}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '1rem'
              }}
            >
              Data Processing
            </button>



            {pipelineLogs.length > 0 && (
              <div style={{ marginTop: '1rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Pipeline Status</div>
                {pipelineLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}

            {processingResult && (
              <div style={{ marginTop: '1rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                <div><strong>Total Wells:</strong> {processingResult.wells}</div>
                <div><strong>Log Types:</strong> {processingResult.logs.join(', ')}</div>
                <div><strong>Composite Index:</strong> {processingResult.index}</div>
                <div><strong>Data Source:</strong> {processingResult.source}</div>
              </div>
            )}
          </div>

          <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
            <h3>Chat Assistant for Earthscan</h3>
            <div
              ref={chatLogRef}
              style={{
                background: '#fafafa',
                height: '200px',
                overflowY: 'auto',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                marginBottom: '1rem',
              }}
            >
              {chatHistory.length === 0 && (
                <div>Bot: Hi! Ask me about optimal well placement and reservoir data!</div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={{ color: msg.sender === 'bot' ? '#007b83' : 'black' }}>
                  <strong>{msg.sender === 'bot' ? 'Bot' : 'You'}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3>Data Inspection and Inference</h3>
          <p>Your files are being processed and analyzed.</p>
          <button onClick={handleShowMap} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}>Show Map</button>
          <button onClick={() => window.open("/digital-twin", "_blank")} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}>Open Well Visualizer</button>
          <button onClick={handleAskImage} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px' }}>Ask Question About Image</button>
        </div>
<button
  onClick={async () => {
    setPipelineLogs(prev => [...prev, formatTimestamped('🔍 Testing API endpoint...')]);
    try {
      const res = await fetch('https://c465-5-178-113-239.ngrok-free.app/merge-well-formation');
      const data = await res.json();
      setPipelineLogs(prev => [
        ...prev,
        formatTimestamped(`✅ Test Success - Status: ${data.status || 'unknown'}`),
      ]);
    } catch (err) {
      setPipelineLogs(prev => [
        ...prev,
        formatTimestamped(`❌ Test Failed - ${err.message}`),
      ]);
    }
  }}
  style={{
    padding: '0.5rem 1rem',
    backgroundColor: '#f57c00',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginLeft: '1rem'
  }}
>
  Test API
</button>
      </div>
    </div>
  );
}
