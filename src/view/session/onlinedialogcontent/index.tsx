import { currentSession } from "api/session"
import { Button } from "components"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useCustomDispatch } from "hooks"
import { LEAVE_SESSION } from "redux/session/session"
import { UserAlias, UserColor, UserInfo, UserList } from "./index.styled"

const OnlineDialogContent: React.FC = () => {
    const dispatch = useCustomDispatch()
    const navigate = useNavigate()

    const handleLeave = () => {
        currentSession().disconnect()
        dispatch(LEAVE_SESSION())
        navigate("/")
    }

    return (
        <>
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
        </>
    )
}

export default OnlineDialogContent
