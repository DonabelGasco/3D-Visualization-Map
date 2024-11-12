const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API route example
app.get('/api/data', (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

// Catch all route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});