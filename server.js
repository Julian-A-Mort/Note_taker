// Set up basic server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
  
  // API route to create and save a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(), // Seem liks a good idea to add a unique ID to the note
        };

        fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error reading notes data." });
            }

            const notes = JSON.parse(data);
            notes.push(newNote);

            // Write new note array
            fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error writing new note." });
                }
                // Send the new note back to the client
                res.json(newNote);
            });
        });
    } else {
        res.status(400).json({ message: "Please add text AND a title... please." });
    }
});

// API route for delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error reading notes data." });
        }

        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error deleting note." });
            }

            res.json({ message: "Note deleted successfully." });
        });
    });
});

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Not working');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });