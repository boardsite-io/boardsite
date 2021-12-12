import React from "react"
import { useCustomSelector } from "hooks"
import {
    SessionInfoWrapper,
    UserAlias,
    UserColor,
    UserInfo,
} from "./sessioninfo.styled"

const SessionInfo: React.FC = () => {
    const userInfo = useCustomSelector((state) => state.session.session?.users)
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
