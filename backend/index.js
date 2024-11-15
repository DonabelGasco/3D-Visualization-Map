const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2'); // Import MySQL

const app = express();

// Enable CORS for development, allowing requests from the Vue development server
app.use(cors({
  origin: 'http://localhost:8080' // Replace this with your frontend’s URL if different
}));

// Serve static files from the Vue production build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'campus_navigation'
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

app.get('/api/search', (req, res) => {
    const query = req.query.q;
    console.log("Received search query:", query); // Log the search query
  
    const sql = `SELECT id, name, x_coordinate AS x, y_coordinate AS y, z_coordinate AS z
                 FROM buildings
                 WHERE LOWER(name) LIKE LOWER(?)`;
  
    db.query(sql, [`%${query}%`], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Database error');
        return;
      }
      console.log("Search results from database:", results); // Log results from database
      res.json(results);
    });
  });
  

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Catch-all route to serve the frontend's index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
