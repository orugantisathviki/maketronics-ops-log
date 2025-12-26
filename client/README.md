Maketronics Ops-Log: From Chaos to Clarity

Submission for Exploratory Full-Stack Development Challenge

1. Problem Interpretation

The core challenge at Maketronics is Information Overload. The factory receives a constant stream of unstructured text—notes from operators, error codes from machines, and status updates from vendors.

Currently, this data is:

Noisy: "Machine A hot" vs "Critical failure in Boiler 3".

Unorganized: No standard format.

Action-less: It requires human cognitive load to decide if a message is a crisis or just a note.

My Solution:
I built Ops-Log, a "Self-Organizing System." It acts as a middleware intelligence layer. It accepts raw text inputs, applies a set of heuristic rules to classify them immediately, and presents them in a visual dashboard where color-coded severity levels allow managers to spot critical issues instantly.

2. System Design

Architecture

The system uses a Client-Server Architecture with a persistent local database.

Frontend (Client): \* Built with React (Vite) for a fast, responsive UI.

Uses CSS Grid for a responsive layout that works on different screen sizes.

Communicates via REST API using axios.

Backend (Server):

Built with Node.js & Express.

Acts as the central controller for data validation and processing.

Database:

SQLite. A relational database stored in a single file (maketronics.db).

Why? It provides full SQL capabilities and persistence without requiring the user to install external server software (like MongoDB or Postgres).

The "Intelligence" Engine

Instead of a black-box AI, I implemented a transparent Rule-Based Classification Engine on the backend.

Input: Raw Text string.

Logic: The system scans for high-entropy keywords.

Critical: "fire", "smoke", "overheat" → Severity: High

Logistics: "delay", "shipping", "vendor" → Severity: Medium

Power: "voltage", "amp" → Severity: High

Output: Structured JSON object { category, severity, timestamp }.

3. Trade-offs Made

Decision

Choice

Trade-off / Reasoning

Database

SQLite

Pros: Zero-configuration, easy to run locally, persistent.

Cons: Not suitable for massive horizontal scaling without migration to PostgreSQL/MySQL.

Analysis

Keyword Heuristics

Pros: Deterministic, instant (0ms latency), no API costs.

Cons: Can miss nuance (e.g., "Not on fire" might be tagged as "Critical"). Real-world version would use an LLM.

UI Framework

Custom CSS

Pros: Lightweight, full control, no massive dependency like Material UI.

Cons: Slower development time for complex components.

State Mgmt

React State

Pros: Simple for this scale.

Cons: If the app grows to 50+ components, would need Redux or Context API.

4. How to Run Locally

Prerequisites

Node.js installed (v14 or higher).

NPM (comes with Node).

Step 1: Clone & Setup

Download or clone the repository to your local machine.

Step 2: Setup Backend (Server)

Open a terminal.

Navigate to the server folder:

cd server

Install dependencies:

npm install

Start the server:

node index.js

You should see: "Server running on http://localhost:3001"

Step 3: Setup Frontend (Client)

Open a new terminal window.

Navigate to the client folder:

cd client

Install dependencies:

npm install

Start the React app:

npm run dev

Open the link shown (usually http://localhost:5173) in your browser.

Usage

Type a message like "Critical voltage drop in Sector 7".

Click Analyze & Save.

Watch it appear instantly in the dashboard with a Red border (High Severity).
