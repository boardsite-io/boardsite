import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import store from "redux/store"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { BoardSession, currentSession } from "api/session"
import { Button, DialogContent, DialogTitle, UserSelection } from "components"
import { DialogState } from "redux/session/session.types"

const JoinOnly: React.FC = () => {
    const { sid } = useParams()
    const [isValidSid, setIsValidSid] = useState<boolean>(true)
    const navigate = useNavigate()

    /**
     * Handle the join session button click in the session dialog
     */
    const handleJoin = async (sessionId: string) => {
        try {
            store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))

            const path = BoardSession.path(sessionId)

            await currentSession().createSocket(path.split("/").pop() ?? "")
            await currentSession().join()

            navigate(path)
        } catch (error) {
            setIsValidSid(false)
        }
    }

    if (!sid) {
        return null
    }

    return (
        <>
            <DialogTitle>Collaborative Session 👋🏻</DialogTitle>
            <DialogContent>
                <UserSelection />
                <Button onClick={() => handleJoin(sid)}>Join Session</Button>
                {!isValidSid && <p>Unable to join session!</p>}
            </DialogContent>
        </>
    )
}

export default JoinOnly
