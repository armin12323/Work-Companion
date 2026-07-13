import "./../styles/main-styles.css"
import { Notes } from "./notes"
import { NotesContent } from "./notes-content"
import { NoteMeetings } from "./note-meetings"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/react"


export function MainNotesView() {

  const [notes, setNotes] = useState([])
  const {user} = useUser()

  useEffect(() => {
        fetch("https://d1-worker.armink499.workers.dev/api/notes", {
            method: 'POST',
            body: JSON.stringify({clerk_id: user.id})
        })
        .then(response => response.json())
        .then(data => {
            setNotes(data.results)
        })
        .catch(error => console.error('Error:', error));
    }, [])

  return (
    <div id="notes-container" className="container">

      <Notes data={notes}/>      

    </div>
  )
}