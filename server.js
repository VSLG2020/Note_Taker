const fs = require('fs');
const { notes } = require('./db/notes.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();


// Sets up the Express app to handle data parsing
//this is middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); //Should allow us to get CSS styles up.

//====create functions for createNote, findbyId, filterByQuery and validate notes

//==filter==//
function filterByQuery(query, notesArray) {
  // const textArray = [];
   const filteredResults = notesArray;
   if (query.title) {
       filteredResults = filteredResults.filter(notes => notes.title === query.title);
   }
   // if (query.text) {
   //     if (typeof query.text === 'string') {
   //       textArray = [query.text];
   //     } else {
   //       textArray = query.text;
   //     }
   //     textArray.forEach(listItem => {
   //       filteredResults = filteredResults.filter(
   //         notes => notes.text.indexOf(listItem) !== -1
   //       );
   //     });
   //   }
   if (query.text) {
     filteredResults = filteredResults.filter(notes => notes.text === query.text);
 }
   return filteredResults;
}

//===findById==//
function findById(id, notesArray) {
  const result = notesArray.filter(notes => notes.id === id)[0];
  return result;
}

//==createNote==//
function createNote(body, notesArray){
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './public/notes.json'),
        //JSON.stringify({notesArray}, null, 2)
        JSON.stringify({ notes: notesArray}, null, 2)
    );

    return note;
}

// //==validate==//
function validate(note) {
    // if (!note.id || typeof note.id !== 'number') {
    //     return false;
    //   }
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
      return false;
    // if (!note.text || !Array.isArray(note.text)) {
    //     return false;
    }
    return true;
}


//////////////////// Routes///////////////////////

//// ===html routes==//

//// root of the server

// router.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html'));
//   });
  


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//send route to return to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});


//api//

//api get//
app.get('/api/notes', (req, res) => {
    const results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// create a get route that returns any given specific note
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    console.log(result);
   res.json(result);
    // if (result) {
    //     res.json(result);
    //   } else {
    //     res.send(404);
    //   }
    ////or/////
    // Iterate through the notes' routeNames to check if it matches `req.params.Notes`
    // for (let i = 0; i < notes.length; i++) {
    //     if (result === notes[i].routeName) {
    //         return res.json(notes[i]);
    //     }
    // }

   // return res.json(result);
});



//////////////post note routes///////////////////////

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
   // console.log(req.body);
    if (!validate(req.body)) {
      res.status(400).send('The note is not properly formatted.');
    } else {
      const note = createNote(req.body, notes);
      res.json(note);
    }

  //  res.json(req.body);
});


// Listener
// ===========================================================
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
