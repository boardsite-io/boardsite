import React from "react"
import Button from "@material-ui/core/Button"
import DialogContent from "@material-ui/core/DialogContent"
import { Grid } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import { CLOSE_SDIAG, CLOSE_WS } from "redux/slice/webcontrol"
import {
    OnlineDialogWrapper,
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
        <OnlineDialogWrapper>
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
            <Button
                fullWidth
                variant="contained"
                onClick={handleLeave}
                color="primary">
                Leave current session
            </Button>
        </OnlineDialogWrapper>
    )
}

export default OnlineDialogContent
