const express = require('express');
const fs = require('fs');
const { notes } = require('./db/db.json');
const path = require('path')

// Dependencies
// ===========================================================


const app = express();
const PORT = 3001;

// Sets up the Express app to handle data parsing
//this is middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); //Should allow us to get CSS styles up.

//create functions for create, findbyId, filter and validate notes===============





// Routes
// ===========================================================

////notes routes/////
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//send route to return to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// create a get route that returns any given specific note
app.get('/api/notes/:id', (req, res) => {
    const chosen = req.params.notes;
    console.log(chosen);
    // Iterate through the notes' routeNames to check if it matches `req.params.Notes`
    for (let i = 0; i < notes.length; i++) {
        if (chosen === notes[i].routeName) {
            return res.json(notes[i]);
        }
    }

    return res.json(false);
});



//post note routes

app.post('/api/notes', (req, res) => {
    const newNotes = req.body;

    console.log(newNotes);

    notes.push(newNotes);

    res.json(newNotes);
});

//send route to return to index.html
//root of the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Listener
// ===========================================================
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
