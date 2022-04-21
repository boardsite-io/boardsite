import { OnlineIcon } from "components"
import React, { memo } from "react"
import { useGState } from "state"
import { online } from "state/online"
import { SessionStatus, StyledMainMenuButton } from "./index.styled"

const SessionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        useGState("Session")

        return (
            <StyledMainMenuButton
                aria-label="Open session menu"
                type="button"
                {...props}
            >
                <OnlineIcon />
                <SessionStatus>
                    {online.getNumberOfUsers() || "+"}
                </SessionStatus>
            </StyledMainMenuButton>
        )
    })
export default SessionButton
