import { disconnect } from "api/websocket"
import { Button, DialogContent } from "components"
import React from "react"
import { useHistory } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "hooks"
import { CLOSE_SESSION_DIALOG } from "redux/session/session"
import {
    UserAlias,
    UserColor,
    UserInfo,
    UserList,
} from "./onlinedialogcontent.styled"

const OnlineDialogContent: React.FC = () => {
    const connectedUsers = useCustomSelector(
        (state) => state.session.connectedUsers
    )

    const dispatch = useCustomDispatch()
    const history = useHistory()
    const handleLeave = () => {
        disconnect()
        dispatch(CLOSE_SESSION_DIALOG())
        history.push("/")
    }

    return (
        <DialogContent>
            <UserList>
                {Object.keys(connectedUsers).map((userId) => {
                    const { alias, color, id } = connectedUsers[userId]
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
