import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import { currentSession } from "api/session"
import { Button, DialogContent, DialogTitle } from "components"
import { useNavigate } from "react-router-dom"
import { SET_SESSION_DIALOG } from "redux/session"
import { DialogState } from "redux/session/index.types"
import { UserAlias, UserColor, UserInfo, UserList } from "./index.styled"

const ManageOnlineSession: React.FC = () => {
    const navigate = useNavigate()

    const handleLeave = () => {
        currentSession().disconnect()
        store.dispatch(SET_SESSION_DIALOG(DialogState.InitialSelection))
        navigate("/")
    }

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="SessionMenu.ManageOnline.Title" />
            </DialogTitle>
            <DialogContent>
                <UserList>
                    {Object.values(currentSession().users ?? {}).map(
                        ({ alias, color, id }) => {
                            return (
                                <UserInfo key={id}>
                                    <UserColor $color={color} />
                                    <UserAlias>{alias}</UserAlias>
                                </UserInfo>
                            )
                        }
                    )}
                </UserList>
                <Button onClick={handleLeave}>
                    <FormattedMessage id="SessionMenu.ManageOnline.LeaveButton" />
                </Button>
            </DialogContent>
        </>
    )
}

export default ManageOnlineSession
