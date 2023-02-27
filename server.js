const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const notes = [];

app.use(express.static(path.join(__dirname, 'js')));
app.use((req, res) => res.sendFile('/index.html', { root: __dirname }));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing notes to the client
  socket.emit('existing notes', notes);

  // Listen for a new note event
  socket.on('new note', (note) => {
    const timestamp = moment().valueOf();
    const newNote = { id: timestamp, text: note, created_at: timestamp };
    notes.push(newNote);
    io.emit('new note', newNote);
  });

  // Listen for a delete note event
  socket.on('delete note', (noteId) => {
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
      io.emit('delete note', noteId);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
