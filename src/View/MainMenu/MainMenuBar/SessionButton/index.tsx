import { OnlineIcon } from "components"
import React, { memo } from "react"
import { useGState } from "state"
import { SessionStatus, StyledMainMenuButton } from "./index.styled"

const SessionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { session } = useGState("Session").online
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
