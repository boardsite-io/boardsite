import { OnlineIcon } from "components"
import React, { memo } from "react"
import { useOnline } from "state/online"
import { SessionStatus, StyledMainMenuButton } from "./index.styled"

const SessionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { session } = useOnline("session")
        return (
            <StyledMainMenuButton type="button" {...props}>
                <OnlineIcon />
                <SessionStatus>
                    {session?.getNumberOfUsers() || "+"}
                </SessionStatus>
            </StyledMainMenuButton>
        )
    })
export default SessionButton
