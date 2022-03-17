import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FormattedMessage } from "language"
import { Button, DialogContent, DialogTitle } from "components"
import { joinOnlineSession } from "../OnlineSession/helpers"
import { UserSelection } from "../OnlineSession/UserSelection"

let submissionActive = false

const OnlineSessionJoinOnly: React.FC = () => {
    const navigate = useNavigate()

    const onSubmitJoinOnly = useCallback(
        async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (submissionActive) return
            submissionActive = true
            const sessionId = window.location.pathname.split("/").pop()
            if (!sessionId) return
            await joinOnlineSession(sessionId, navigate)
            submissionActive = false
        },
        [navigate]
    )

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="DialogMenu.JoinOnly.Title" />
            </DialogTitle>
            <DialogContent>
                <form onSubmit={onSubmitJoinOnly}>
                    <UserSelection />
                    <Button type="submit">
                        <FormattedMessage id="DialogMenu.JoinOnly.JoinButton" />
                    </Button>
                </form>
            </DialogContent>
        </>
    )
}

export default OnlineSessionJoinOnly
