import { Button, DialogContent } from "components"
import React from "react"
import { useHistory } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import { CLOSE_SDIAG, CLOSE_WS } from "redux/slice/webcontrol"
import {
    UserAlias,
    UserColor,
    UserInfo,
    UserList,
} from "./onlinedialogcontent.styled"

const OnlineDialogContent: React.FC = () => {
    const connectedUsers = useCustomSelector(
        (state) => state.webControl.connectedUsers
    )

    const dispatch = useCustomDispatch()
    const history = useHistory()
    const handleLeave = () => {
        dispatch(CLOSE_WS())
        dispatch(CLOSE_SDIAG())
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
