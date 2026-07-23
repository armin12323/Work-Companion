import "./../styles/main-styles.css"
import { useEffect, useState } from "react"
import { NotesContent } from "./notes-content"
import { NoteMeetings } from "./note-meetings"
import { useUser } from "@clerk/react"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


export function Note(props) {

    const [notes, setNote] = useState({})
    const {user} = useUser()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const date = new Date(props.note.date_created);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const d = new Intl.DateTimeFormat('en-US', options).format(date);

    useEffect(() => {
        console.log('.')
    }, [notes])

    return (
        <>
            <div style={{display: "flex", "marginBottom": "5px"}}>
                <div style={{order: 0, flex: "auto"}} key={props.note.title} className="note" onClick={() => props.noteOpen(props.noteId)}>
                    <li className="no-bullet-pts">{props.note.title}</li>
                    <div className="note-date">{d}</div>
                </div>
                <Button variant="primary" onClick={() => props.noteDeletion(props.note.id)} style={{"marginLeft": "5px"}}>
                    <div>
                        {props.showNote ? <div>You sure?</div> : <div>x</div>}
                    </div>
                    {/* <div>x</div> */}
                </Button>
            </div>
        
        </>
        
    )
}