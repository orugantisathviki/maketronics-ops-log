const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow backend to read JSON data

// --- 1. Database Setup (SQLite) ---
// This creates a file named 'maketronics.db' in your server folder
const db = new sqlite3.Database("./maketronics.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            raw_text TEXT,
            category TEXT,
            severity TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
  }
});

// --- 2. The Intelligence (Classification Logic) ---
function analyzeLog(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("hot") ||
    lower.includes("overheat") ||
    lower.includes("fire") ||
    lower.includes("smoke")
  ) {
    return { category: "Critical Hardware", severity: "High" };
  }
  if (
    lower.includes("delay") ||
    lower.includes("shipping") ||
    lower.includes("vendor")
  ) {
    return { category: "Logistics", severity: "Medium" };
  }
  if (
    lower.includes("voltage") ||
    lower.includes("amp") ||
    lower.includes("power")
  ) {
    return { category: "Power Grid", severity: "High" };
  }
  if (lower.includes("success") || lower.includes("completed")) {
    return { category: "Operations", severity: "Low" };
  }

  return { category: "General Note", severity: "Low" };
}

// --- 3. API Routes ---

// GET: Fetch all logs from database
app.get("/api/logs", (req, res) => {
  const sql = "SELECT * FROM logs ORDER BY id DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "success", data: rows });
  });
});

// POST: Receive new messy text, process it, and save to DB
app.post("/api/logs", (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ error: "Text is required" });
    return;
  }

  // Run our "AI" logic
  const analysis = analyzeLog(text);

  // SQL Insert command
  const sql = "INSERT INTO logs (raw_text, category, severity) VALUES (?,?,?)";
  const params = [text, analysis.category, analysis.severity];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: {
        id: this.lastID,
        raw_text: text,
        ...analysis,
      },
    });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
