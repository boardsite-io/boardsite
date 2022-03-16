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
    const { session } = useGState("Session").online

    const onKickUser = useCallback(async () => {
        try {
            await session?.kickUser({ id: userId })
        } catch (error) {
            notification.create("Notification.Session.KickUserFailed", 3000)
        }
    }, [session, userId])

    return (
        <SubMenuWrap>
            <MenuItem
                disabled={!isHost || userIsYou || !online.state.isAuthorized()}
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
