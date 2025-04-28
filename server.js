const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const documents = new Map(); // More efficient than an object

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname)));

// WebSocket Connection Handling
wss.on("connection", (ws) => {
    ws.on("message", (message) => handleMessage(ws, message));
});

// Handle WebSocket Messages
const handleMessage = (ws, message) => {
    try {
        const data = JSON.parse(message);
        
        if (data.type === "edit") {
            documents.set(data.docId, data.content);
            broadcast({ type: "update", docId: data.docId, content: data.content });
        }
    } catch (error) {
        console.error("Invalid WebSocket message:", error.message);
    }
};

// Broadcast Message to All Clients
const broadcast = (data) => {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(message);
    });
};

// API Endpoints
app.get("/document/:id", (req, res) => {
    res.json({ content: documents.get(req.params.id) || "" });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
