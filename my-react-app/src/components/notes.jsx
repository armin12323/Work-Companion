import "./../styles/main-styles.css"
import { useEffect, useState } from "react"
import { NotesContent } from "./notes-content"
import { NoteMeetings } from "./note-meetings"
import { useUser } from "@clerk/react"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


export function Notes(data) {

    const [notes, setNote] = useState({})
    const [title, setTitle] = useState("")
    const [noteOpen, setNoteOpen] = useState(false)
    const [openedNoteID, setOpenedNoteID] = useState(null)
    const [addNote, setAddNote] = useState(false)
    const [show, setShow] = useState(false);
    const {user} = useUser()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const updateNote = (updatedNote, partOfNote) => {

        if (partOfNote === 'title') {
            setNote((notes) => {
                return {
                    ...notes,
                    [openedNoteID]: {
                        ...notes[openedNoteID],
                        [partOfNote]: updatedNote
                    }
                }
            })
        }

        if (partOfNote === 'dueDate') {
            setNote((notes) => {
                return {
                    ...notes,
                    [openedNoteID]: {
                        ...notes[openedNoteID],
                        [partOfNote]: updatedNote.toString()
                    }
                }
            })
        }

        if (partOfNote === 'note') {
            setNote((notes) => {
                return {
                    ...notes,
                    [openedNoteID]: {
                        ...notes[openedNoteID],
                        [partOfNote]: updatedNote
                    }
                }
            })
        }

    }

    useEffect(() => {

        // REMEMBER HOW STATE WORKS, STATE IS UPDATED AFTERRRRRRR USEEFFECT RUNS. ITS THE NEXT RENDER.

        //LOOP THRU DATA TO CREATE OBJECTS FOR EACH NOTE WITH ID AS KEY
        const dataLen = data.data.length

        const newNotes = {}
        
        for (let i = 0; i < dataLen; i ++) {
            const noteID = data.data[i].id

            newNotes[noteID] = data.data[i]

        }

        setNote(newNotes)
    }, [data])

    useEffect(() => {
        console.log('RERENDER FOR NOTES, IGNORE')
    }, [notes])

    function addNewNote() {

        const timestamp = Date.now()
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        }).format(timestamp);

        const postNote = fetch("https://d1-worker.armink499.workers.dev/api/notes/add", {
            method: 'POST',
            body: JSON.stringify({title: title, note: '', date_created: formattedDate, modified: formattedDate, due_date: '', clerk_id: user.id})
        }).then((response) => response.json())
        .then((result) => {
            const newNoteUserID = result.userID
            const newNoteID = result.noteID
            const allNotes = notes
            const newNote = {id: newNoteID, title: title, note: '', date_created: formattedDate, modified: formattedDate, due_date: '', user_id: newNoteUserID}
            const updatedNotes = {...notes, newNote}

            setNote(updatedNotes)
        })
        .catch((error) => {
            APIErrorHandler(error);
        });

        


    }

    const deleteNote = (id) => {

        console.log('DELETE NOTEEE id: ', id)
        if (!show) {
            setShow(true)
        }
        else {
            setShow(false)
        }

        // const deleteNote = fetch("https://d1-worker.armink499.workers.dev/api/notes/delete", {
        //     method: 'DELETE',
        //     body: JSON.stringify({id: id, clerk_id: user.id})
        // }).then((response) => response.json())
        // .then((result) => {
        //     console.log('result for deleting api call: ', result)
        // })
        // .catch((error) => {
        //     APIErrorHandler(error);
        // });

        //something for notes to trigger re-render.
    }

    const setContentMeetingState = (id) => {

        if (noteOpen && openedNoteID === id) {
            setNoteOpen(false) //close note contents.
            setOpenedNoteID(null)
        }

        else {
            setNoteOpen(true)
            setOpenedNoteID(id)
        }
    }

    return (
        <>
            <div id="notes-div" className="notes-box">
                <div className="title-div">
                    <div className="gradient-outline">
                        Notes
                    </div>
                </div>
                <form id="task_div">
                    <ul id="note-list" style={{"paddingLeft": "0px"}}>
                        {Object.keys(notes).map((key, note) => (
                            <div style={{display: "flex", "marginBottom": "5px"}}>
                                <div style={{order: 0, flex: "auto"}} key={notes[key].title} className="note" onClick={() => setContentMeetingState(key)}>
                                    <li className="no-bullet-pts">{notes[key].title}</li>
                                    <div className="note-date">{notes[key].date_created}</div>
                                </div>
                                <Button variant="primary" onClick={() => deleteNote(key)} style={{"marginLeft": "5px"}}>
                                    <div>
                                        {show ? <div>Delete?</div> : <div>You sure?</div>}
                                    </div>
                                    {/* <div>x</div> */}
                                </Button>
                                

                            </div>
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

            <NotesContent isContentOpen={noteOpen} note={notes[openedNoteID]} noteUpdateFunction={updateNote}/>
            <NoteMeetings isContentOpen={noteOpen} noteID={openedNoteID}/>


      </>



    )
}