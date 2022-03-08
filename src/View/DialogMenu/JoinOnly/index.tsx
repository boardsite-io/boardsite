import { FormattedMessage } from "language"
import React from "react"
import { Button, DialogContent, DialogTitle, UserSelection } from "components"
import { useNavigate, useParams } from "react-router-dom"
import { BoardSession } from "api/session"
import { online } from "state/online"
import { DialogState } from "state/online/state/index.types"
import { notification } from "state/notification"

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

            const session = new BoardSession(online.state.userSelection)
            await session.createSocket(path.split("/").pop() ?? "")
            await session.join()
            online.newSession(session)

            navigate(path)
        } catch (error) {
            notification.create("Notification.Session.JoinFailed")
            navigate("/")
        }
    }

    if (!sid) {
        return null
    }

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="DialogMenu.JoinOnly.Title" />
            </DialogTitle>
            <DialogContent>
                <UserSelection />
                <Button onClick={onClickJoin}>
                    <FormattedMessage id="DialogMenu.JoinOnly.JoinButton" />
                </Button>
            </DialogContent>
        </>
    )
}

export default JoinOnly
