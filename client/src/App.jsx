import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load logs from backend when page opens
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('https://maketronics-ops-log.onrender.com/api/logs');
      setLogs(response.data.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
      // Fallback for demo if backend isn't running
      if (logs.length === 0) {
        console.log("Backend might be down, showing empty state or cached data would go here.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Send raw text to backend
      await axios.post('https://maketronics-ops-log.onrender.com/api/logs', { text: input });
      // Clear input and reload list
      setInput('');
      fetchLogs();
    } catch (error) {
      console.error("Error submitting log:", error);
      alert("Failed to submit log. Make sure the backend server is running on port 3001!");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Internal Styles for Simplicity */}
      

      <header>
        <h1>Maketronics Ops-Log</h1>
        <p>From Chaos to Clarity</p>
      </header>

      <main>
        {/* Input Section */}
        <section className="input-section">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter unstructured log (e.g., 'Machine A overheating in Sector 4')"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Analyze & Save'}
            </button>
          </form>
        </section>

        {/* Results Section */}
        <section className="results-section">
          <h2>Operational Insights</h2>
          <div className="log-grid">
            {logs.map((log) => (
              <div key={log.id} className={`log-card ${log.severity?.toLowerCase() || 'low'}`}>
                <div className="card-header">
                  <span className="category-tag">{log.category}</span>
                  <span className="time-tag">ID: {log.id}</span>
                </div>
                <p className="raw-text">"{log.raw_text}"</p>
                <div className="card-footer">
                  <span className="severity-indicator">Severity: {log.severity}</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="empty-state">No logs found. Start typing above!</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
