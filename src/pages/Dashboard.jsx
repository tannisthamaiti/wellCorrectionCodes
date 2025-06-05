import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ProcessingSteps from './ProcessingSteps'; // Adjust path if needed

export default function Dashboard() {
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [runProcessing, setRunProcessing] = useState(false);
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
      setChatHistory((prev) => [...prev, { sender: 'bot', text: data.response || 'No answer returned.' }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: 'bot', text: `Error: ${error.message}` }]);
    }
  };

  const handleROICalculate = () => {
    const wells = parseFloat(document.getElementById('wells').value);
    const personnel = parseFloat(document.getElementById('personnel').value);
    const salary = parseFloat(document.getElementById('salary').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const savings = parseFloat(document.getElementById('savings').value);

    const workHoursPerPerson = 2078.4;
    const wagePerHour = salary / workHoursPerPerson;
    const totalManualHours = wells * hours;
    const hoursSaved = totalManualHours * savings;
    const laborCostSaved = hoursSaved * wagePerHour;

    document.getElementById('result').innerText =
      `Estimated Labor Cost Saved: $${laborCostSaved.toFixed(2)}`;

    setRunProcessing(true); // trigger ProcessingSteps
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f5f8fc', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 600 }}>
          File Summary and Mapping of Wells
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
            <h3>ROI Tool</h3>
            <p>Estimate labor savings based on your operations.</p>
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

        <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', marginTop: '2rem', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ textAlign: 'center' }}>ROI Calculator</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: 'auto' }}>
            <label>Number of Wells per Year:
              <input type="number" id="wells" style={{ width: '100%', padding: '0.5rem' }} />
            </label>
            <label>Personnel Involved:
              <input type="number" id="personnel" style={{ width: '100%', padding: '0.5rem' }} />
            </label>
            <label>Average Team Salary/Year (USD):
              <input type="number" id="salary" style={{ width: '100%', padding: '0.5rem' }} />
            </label>
            <label>Manual Man-Hours per Well:
              <input type="number" id="hours" style={{ width: '100%', padding: '0.5rem' }} />
            </label>
            <label>% Time Savings (0 to 1):
              <input type="number" step="0.01" id="savings" style={{ width: '100%', padding: '0.5rem' }} />
            </label>
            <button onClick={handleROICalculate} style={{
              padding: '0.75rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Calculate ROI
            </button>
            <div id="result" style={{ marginTop: '1rem', fontWeight: 'bold', textAlign: 'center' }}></div>
          </div>
        </div>

        {runProcessing && (
          <div style={{ marginTop: '2rem' }}>
            <ProcessingSteps
              files={[]} // replace with actual uploaded files if needed
              onComplete={(finalData) => {
                console.log("✅ Processing complete", finalData);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
