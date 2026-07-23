import "./../styles/main-styles.css"
import { NotesContent } from "./notes-content"
import { NoteMeetings } from "./note-meetings"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/react"
import { Note } from "./note"


export function MainNotesView() {

  const [notes, setNotes] = useState([])
  const [notesToUpdate, updateNote] = useState({})
  const [title, setTitle] = useState("")
  const [noteOpen, setNoteOpen] = useState(false);
  const [openedNoteID, setOpenedNoteID] = useState(null);
  const [noteUpdate, setNoteUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null)
  const {user} = useUser()

  const fetchNotes = () => {
    fetch("https://d1-worker.armink499.workers.dev/api/notes", {
            method: 'POST',
            body: JSON.stringify({clerk_id: user.id})
        })
        .then(response => response.json())
        .then(data => {
            setNotes(data.results)
        })
        .catch((error) => {
        APIErrorHandler(error);
    });
  }

  useEffect(() => {

    // console.log('.')

  }, [notes])

  useEffect(() => {
        fetchNotes()
    }, [noteUpdate])

  function addNewNote() {

    const timestamp = Date.now()
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    }).format(timestamp);

    const body = JSON.stringify({title: title, note: '', date_created: timestamp, modified: formattedDate, due_date: '', clerk_id: user.id})

    const postNote = fetch("https://d1-worker.armink499.workers.dev/api/notes/add", {
        method: 'POST',
        body: body
    }).then((response) => response.json())
    .then((result) => {

      const newNoteUserID = result.userID
      console.log('result.noteID: ', result.noteID)
      const newNoteID = result.noteID
      const allNotes = notes
      const newNote = {id: newNoteID, title: title, note: '', date_created: formattedDate, modified: formattedDate, due_date: '', user_id: newNoteUserID}

    }).then(() => {
      setTitle("")
      fetchNotes()
    })
  }

  const deleteNote = (id) => {

    if (noteToDelete !== id) {
      setNoteToDelete(id)
      return
    }

    setNoteToDelete(null)

        fetch("https://d1-worker.armink499.workers.dev/api/notes/delete", {
            method: 'DELETE',
            body: JSON.stringify({id: id, clerk_id: user.id})
        }).then((response) => {
            console.log('.')
        }).then(() => {
          fetchNotes();
        })
      }

  const setContentMeetingState = (id) => {

    if (noteOpen && openedNoteID === id) {
        setNoteOpen(false)
        setOpenedNoteID(null)
    }

    else {
        setNoteOpen(true)
        setOpenedNoteID(id)
    }
  }

  const updateNoteInState = (newValue, partOfNote) => {

      if (partOfNote === 'title') {
          updateNote((notesToUpdate) => {
              return {
                  ...notesToUpdate,
                  [openedNoteID]: {
                      ...notesToUpdate[openedNoteID],
                      [partOfNote]: newValue
                  }
              }
          })
      }

      if (partOfNote === 'dueDate') {
          updateNote((notesToUpdate) => {
              return {
                  ...notesToUpdate,
                  [openedNoteID]: {
                      ...notesToUpdate[openedNoteID],
                      [partOfNote]: newValue.toString()
                  }
              }
          })
      }

      if (partOfNote === 'note') {
          updateNote((notesToUpdate) => {
              return {
                  ...notesToUpdate,
                  [openedNoteID]: {
                      ...notesToUpdate[openedNoteID],
                      [partOfNote]: newValue
                  }
              }
          })
      }

      setNoteUpdate(prev => !prev);
  }

  console.log('INFINITE LOOP CHECK')

  return (
    <div id="notes-container" className="container">

      <div id="notes-div" className="notes-box">
          <div className="title-div">
              <div className="gradient-outline">
                  Notes
              </div>
          </div>
          <form id="task_div">
              <ul id="note-list" style={{"paddingLeft": "0px"}}>
                  {Object.keys(notes).map((key, note) => (
                    <Note noteId={note} note={notes[key]} noteOpen={setContentMeetingState} noteDeletion={deleteNote} showNote={noteToDelete === notes[key].id}/>
                  ))}
              </ul>
              <input 
                  type="text" 
                  id="title" 
                  className="gradient-outline-no-bg" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
          </form>

          <div style={{"paddingLeft": "50px"}}>
              <button onClick={addNewNote} id="new-note-btn" className="gradient-outline">
                  Enter
              </button>

          </div>
      </div>    

      <NotesContent isContentOpen={noteOpen} note={notes[openedNoteID]} noteUpdateFunction={updateNoteInState} refreshNotes={fetchNotes}/>
      {/* <NoteMeetings isContentOpen={noteOpen} noteID={openedNoteID}/>  */}

    </div>
  )
}
