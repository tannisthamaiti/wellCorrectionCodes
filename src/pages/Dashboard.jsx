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
  const [chatOpen, setChatOpen] = useState(false);
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
      const response = await fetch(`https://etscan.org/explain?prompt=${encodeURIComponent(userInput)}`);
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
    const response = await fetch('https://etscan.org/merge-well-formation', {
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
        formatTimestamped('🧠 Triggering PCA Cluster...'),
      ]);

      const pcaResponse = await fetch('https://etscan.org/sparsity-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const pcaData = await pcaResponse.json();

      if (pcaResponse.ok && pcaData.result) {
        setPipelineLogs(prev => [
          ...prev,
          formatTimestamped(`✅ Filtered data complete: ${pcaData.result}`),
          formatTimestamped('📊 Generating PCA plot...'),
        ]);

        // NEW PCA Plot Request
        const plotResponse = await fetch('https://etscan.org/pca-plot/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
        });

        const plotData = await plotResponse.json();

        if (plotResponse.ok && plotData.status === 'success') {
          setPipelineLogs(prev => [
            ...prev,
            formatTimestamped(`✅ ${plotData.message}`),
            formatTimestamped(`🖼️ Plot Path: ${plotData.plot_path}`),
          ]);
        } else {
          setPipelineLogs(prev => [
            ...prev,
            formatTimestamped(`⚠️ PCA plot generation failed: ${JSON.stringify(plotData)}`),
          ]);
        }

      } else {
        setPipelineLogs(prev => [
          ...prev,
          formatTimestamped(`⚠️ Filtered data failed: ${JSON.stringify(pcaData)}`),
        ]);
      }
    } else {
      setPipelineLogs(prev => [
        ...prev,
        formatTimestamped(`API responded with status: ${data.status}`),
      ]);
    }
  } catch (error) {
    setPipelineLogs(prev => [
      ...prev,
      formatTimestamped(`❌ API request failed: ${error.message}`),
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
            <h3>Build Logs</h3>
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
              Model Training
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
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3>Data Inspection and Inference</h3>
          <p>Your files are being processed and analyzed.</p>
          <button onClick={handleShowMap} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}>Pinn Inference</button>
          <button onClick={() => window.open("/digital-twin", "_blank")} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}>Production Results</button>
          <button onClick={handleAskImage} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px' }}>Vug Analysis</button>
        </div>

        {/* Floating Chat Widget */}
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            style={{
              backgroundColor: '#ffc107',
              color: '#000',
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
          >
            {chatOpen ? 'Close Chat' : 'Chat Now!'}
          </button>

          {chatOpen && (
            <div
              style={{
                marginTop: '0.5rem',
                width: '320px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                padding: '1rem',
                position: 'relative',
                bottom: '3.5rem',
                right: '0.25rem',
              }}
            >
              {/* Close Icon */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
                onClick={() => setChatOpen(false)}
              >
                &times;
              </div>

              <div
                ref={chatLogRef}
                style={{
                  background: '#fafafa',
                  height: '180px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  marginBottom: '0.5rem',
                  fontSize: '0.85rem'
                }}
              >
                {chatHistory.length === 0 && (
                  <div>Bot: Hi! Ask me about optimal well placement and reservoir data!</div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} style={{ color: msg.sender === 'bot' ? '#007b83' : '#333' }}>
                    <strong>{msg.sender === 'bot' ? 'Bot' : 'You'}:</strong> {msg.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
