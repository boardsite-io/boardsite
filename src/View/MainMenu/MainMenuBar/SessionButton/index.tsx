import React, { memo } from "react"
import { BsPeople } from "react-icons/bs"
import { useOnline } from "state/online"
import { MainMenuButton } from "../index.styled"

const SessionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    memo((props) => {
        const { session } = useOnline()
        return (
            <MainMenuButton type="button" {...props}>
                <BsPeople id="transitory-icon" />
                {Object.keys(session?.users ?? {}).length}
            </MainMenuButton>
        )
    })
export default SessionButton
