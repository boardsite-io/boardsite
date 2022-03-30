import React, { useCallback } from "react"
import { online } from "state/online"
import { notification } from "state/notification"
import { useGState } from "state"
import { FormattedMessage } from "language"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

type UserOptionsProps = {
    userId: string
    isHost: boolean
    userIsYou: boolean
}

const UserOptions = ({ userId, isHost, userIsYou }: UserOptionsProps) => {
    useGState("Session")

    const onKickUser = useCallback(async () => {
        try {
            await online.kickUser({ id: userId })
        } catch (error) {
            notification.create("Notification.Session.KickUserFailed", 3000)
        }
    }, [userId])

    return (
        <SubMenuWrap>
            <MenuItem
                disabled={!isHost || userIsYou || !online.isAuthorized()}
                warning
                text={
                    <FormattedMessage id="Menu.General.Session.UserOptions.Kick" />
                }
                onClick={onKickUser}
            />
            {/* TODO: Change user name / color, give admin rights, etc */}
        </SubMenuWrap>
    )
}
export default UserOptions
