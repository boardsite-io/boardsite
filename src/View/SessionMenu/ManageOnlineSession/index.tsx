import { FormattedMessage } from "language"
import React from "react"
import { online, useOnline } from "state/online"
import { DialogState } from "state/online/state/index.types"
import { Button, DialogContent, DialogTitle } from "components"
import { useNavigate } from "react-router-dom"
import { UserAlias, UserColor, UserInfo, UserList } from "./index.styled"

const ManageOnlineSession: React.FC = () => {
    const navigate = useNavigate()
    const { session } = useOnline()

    const handleLeave = () => {
        session?.disconnect()
        online.setSessionDialog(DialogState.InitialSelection)
        navigate("/")
    }

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="SessionMenu.ManageOnline.Title" />
            </DialogTitle>
            <DialogContent>
                <UserList>
                    {Object.values(session?.users ?? {}).map(
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
