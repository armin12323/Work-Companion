import "./../styles/main-styles.css"

export function NoteMeetings(props) {

    if (props.isContentOpen){
        return (
            <div id="meeting-div" className="meetings-box">
                <div id="note-creation-meeting-div-title" className="gradient-outline">
                    Meetings Coming Soon!
                </div>
            </div>
        )
    }
    
}