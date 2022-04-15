import React, { useCallback } from "react"
import { FormattedMessage } from "language"
import { Button, DialogContent, DialogTitle } from "components"
import { online } from "state/online"
import { notification } from "state/notification"

const OnlineLeave: React.FC = () => {
    const leaveSession = useCallback(() => {
        online.disconnect()
        notification.create("Notification.Session.Leave", 3000)
    }, [])

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.OnlineLeave" />
            </DialogTitle>
            <DialogContent>
                <p>
                    {Object.keys(online.getState().session.users ?? {})
                        .length === 1 ? (
                        <FormattedMessage id="Dialog.OnlineLeave.Text.LeaveLast" />
                    ) : (
                        <FormattedMessage id="Dialog.OnlineLeave.Text.Leave" />
                    )}
                </p>
                <Button onClick={leaveSession}>
                    <FormattedMessage id="Dialog.OnlineLeave.Button" />
                </Button>
            </DialogContent>
        </>
    )
}

export default OnlineLeave
