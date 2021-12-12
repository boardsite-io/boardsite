import { currentSession } from "api/session"
import { Button, DialogContent } from "components"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useCustomDispatch } from "hooks"
import { CLOSE_SESSION_DIALOG } from "redux/session/session"
import {
    UserAlias,
    UserColor,
    UserInfo,
    UserList,
} from "./onlinedialogcontent.styled"

const OnlineDialogContent: React.FC = () => {
    const dispatch = useCustomDispatch()
    const navigate = useNavigate()

    const handleLeave = () => {
        currentSession().disconnect()
        dispatch(CLOSE_SESSION_DIALOG())
        navigate("/")
    }

    return (
        <DialogContent>
            <UserList>
                {Object.values(currentSession().users ?? {}).map((user) => {
                    const { alias, color, id } = user
                    return (
                        <UserInfo key={id}>
                            <UserColor $color={color} />
                            <UserAlias>{alias}</UserAlias>
                        </UserInfo>
                    )
                })}
            </UserList>
            <Button onClick={handleLeave}>Leave current session</Button>
        </DialogContent>
    )
}

export default OnlineDialogContent
