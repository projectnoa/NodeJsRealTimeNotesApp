const socket = io();

const notesDiv = document.querySelector('#notes');

socket.on('existing notes', (existingNotes) => {
  existingNotes.forEach((note) => {
    const noteElem = createNoteElement(note);
    notesDiv.appendChild(noteElem);
  });
});

const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const note = noteInput.value;
  socket.emit('new note', note);
  noteInput.value = '';
});

function createNoteElement(note) {
  const noteElem = document.createElement('div');
  noteElem.classList.add('note');
  noteElem.setAttribute('data-note-id', note.id);

  const textElem = document.createElement('div');
  textElem.classList.add('text');
  textElem.innerText = note.text;

  const deleteElem = document.createElement('div');
  deleteElem.classList.add('delete');
  deleteElem.innerText = 'X';
  deleteElem.addEventListener('click', () => {
    deleteNoteElement(note.id);
  });

  noteElem.appendChild(textElem);
  noteElem.appendChild(deleteElem);

  return noteElem;
}

socket.on('new note', (note) => {
  const noteElem = createNoteElement(note);
  notesDiv.appendChild(noteElem);
});

function deleteNoteElement(noteId) {
  const noteElem = document.querySelector(`[data-note-id="${noteId}"]`);

  if (noteElem) {
    noteElem.remove();
    socket.emit('delete note', noteId);
  }
}

socket.on('delete note', (noteId) => {
  deleteNoteElement(noteId);
});
