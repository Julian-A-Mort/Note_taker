// Set up basic server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
app.listen(PORT, () => {
});

// Set up Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  // serve the notes page
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });

  // API route to retrieve/get notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Notes data can not be retrieved!" });
      }
      res.json(JSON.parse(data));
    });
  });

  // Return index.html for GET requests that are not handled
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
  