const fs = require('fs');
const { notes } = require('./db/notes');
const express = require('express');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
//this is middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

////////create functions for createNote, findbyId, filterByQuery and validate notes///////

//==createNote==//
function createNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/notes.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

//===findById==//
function findById(id, notesArray) {
  const result = notesArray.filter(notes => notes.id === id)[0];
  return result;
}

//==filter==//
function filterByQuery(query, notesArray) {
  
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(notes => notes.title === query.title);
  }
  if (query.text) {
    filteredResults = filteredResults.filter(notes => notes.text === query.text);
  }
  return filteredResults;
}

// //==validate==//
function validate(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
}


//////////////////// Routes///////////////////////

//===html routes==//

//root of the server

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//send route to return to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});


/////api/////

//api get//
app.get('/api/notes', (req, res) => {
  let results = notes;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// create a get route that returns any given specific note
app.get('/api/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);
  //console.log(result);
 // if (result) {
    res.json(result);
  // } else {
  //   res.send(404);
  // }

  // return res.json(result);
});



//////////////post note routes///////////////////////

app.post('/api/notes', (req, res) => {
  req.body.id = notes.length.toString();
  //console.log(req.body);
  if (!validate(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    const note = createNote(req.body, notes);
    res.json(note);
  }

  //  res.json(req.body);
});


////////////////Listener////////////////////

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
