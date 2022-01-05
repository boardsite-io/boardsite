import { currentSession } from "api/session"
import { Button, DialogContent, DialogTitle } from "components"
import React from "react"
import { useNavigate } from "react-router-dom"
import store from "redux/store"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { DialogState } from "redux/session/session.types"
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
            <DialogTitle>Collaborative Session 👋🏻</DialogTitle>
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
            </DialogContent>{" "}
        </>
    )
}

export default ManageOnlineSession
