import { FormattedMessage } from "language"
import React from "react"
import { Button, DialogContent, DialogTitle, UserSelection } from "components"
import { useNavigate, useParams } from "react-router-dom"
import { BoardSession, currentSession } from "api/session"
import { handleNotification } from "drawing/handlers"
import { online } from "state/online"
import { DialogState } from "state/online/state/index.types"

const JoinOnly: React.FC = () => {
    const { sid } = useParams()
    const navigate = useNavigate()

    /**
     * Handle the join session button click in the session dialog
     */
    const onClickJoin = async () => {
        if (!sid) {
            return
        }

        try {
            online.setSessionDialog(DialogState.Closed)

            const path = BoardSession.path(sid)

            await currentSession()
                .setID(sid)
                .createSocket(path.split("/").pop() ?? "")
            await currentSession().join()

            navigate(path)
        } catch (error) {
            handleNotification("SessionMenu.JoinOnly.UnableToJoin.Notification")
            navigate("/")
        }
    }

    if (!sid) {
        return null
    }

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="SessionMenu.JoinOnly.Title" />
            </DialogTitle>
            <DialogContent>
                <UserSelection />
                <Button onClick={onClickJoin}>
                    <FormattedMessage id="SessionMenu.JoinOnly.JoinButton" />
                </Button>
            </DialogContent>
        </>
    )
}

export default JoinOnly
