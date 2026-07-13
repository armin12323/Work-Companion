import "./../styles/main-styles.css"
import { useUser } from "@clerk/react"
import { useEffect, useState } from "react"

export function NotesContent(props) {

    const [noteTitle, setNoteTitle] = useState('')
    const [noteNote, setNoteNote] = useState('')
    const [noteDueDate, setNoteDueDate] = useState('')
    const [noteTimeCreated, setNoteTimeCreated] = useState('')
    const {user} = useUser()

    useEffect(() => {
        setNoteTitle(props.note?.title)
        setNoteNote(props.note?.note)
        setNoteDueDate(props.note?.due_date)
        setNoteTimeCreated(props.note?.date_created)
    }, [props])


    const handleBlur = (t) => {
        const newText = t.nativeEvent.target.value
        const body = JSON.stringify({title: noteTitle, note: noteNote, date_created: noteTimeCreated, modified: '06/07/2026', due_date: noteDueDate, clerk_id: user.id})

        fetch("https://d1-worker.armink499.workers.dev/api/notes/update", {
            method: 'PUT',
            body: body
        })
    };

    // useEffect(() =>{
    //     console.log('rerender')
    // }, [noteTitle, noteNote, noteDueDate, noteTimeCreated])
    
    if (props.isContentOpen) {
        return (
            <div id="notes-config-div" className="notes-config-box">
                <div className="title-div">
                    <div id="note-creation-div-title" className="gradient-outline">
                        Note Creation
                    </div>
                </div>
                <div className="container">
                    <div className="title-div">
                        <h6 style={{margin: 0}}>Title</h6>
                        <input placeholder="Title" value={noteTitle} onBlur={handleBlur} onChange={(e) => {
                            setNoteTitle(e.target.value);
                            props.noteUpdateFunction(e.target.value, 'title');
                            }}></input>
                    </div>
                    <div className="timestamp-div">
                        <h6 style={{margin: 0}}>Date Created</h6>
                        <input placeholder="Date Created" value={noteTimeCreated}></input>
                    </div>
                    <div className="dueDate-div">
                        {/* <h6 style={{margin: 0}}>Due Date</h6> */}
                        {/* <input placeholder="Due Date" value={noteDueDate} onBlur={handleBlur} onChange={(e) => {
                            setNoteDueDate(e.target.value);
                            props.noteUpdateFunction(e.target.value, 'dueDate');
                            }}></input> */}
                    </div>
                </div>
                <div>
                    <textarea value={noteNote} id="note-text-box" placeholder="Notes ..." className="textarea-style" onBlur={handleBlur} onChange={(e) => {
                        setNoteNote(e.target.value);
                        props.noteUpdateFunction(e.target.value, 'note');
                        }}></textarea>
                </div>
            </div>
        )
    }
}