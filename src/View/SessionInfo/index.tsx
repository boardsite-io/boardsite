import React from "react"
import { online } from "state/online"
import {
    SessionInfoWrapper,
    UserAlias,
    UserColor,
    UserInfo,
} from "./index.styled"

const SessionInfo: React.FC = () => {
    const userInfo = online.getState().session?.users
    return (
        <SessionInfoWrapper>
            {Object.values(userInfo ?? {}).map(({ alias, color, id }) => (
                <UserInfo key={id}>
                    <UserColor $color={color} />
                    <UserAlias>{alias}</UserAlias>
                </UserInfo>
            ))}
        </SessionInfoWrapper>
    )
}

export default SessionInfo
