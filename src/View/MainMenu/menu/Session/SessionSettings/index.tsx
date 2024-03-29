import React from "react"
import { TickIcon } from "components"
import { useGState } from "state"
import { online } from "state/online"
import { Session } from "state/online/state/index.types"
import { FormattedMessage } from "language"
import { SubMenuWrap } from "View/MainMenu/index.styled"
import MenuItem from "View/MainMenu/MenuItem"

const onClickReadOnly = (session: Session | undefined) => () =>
    online.updateConfig({ readOnly: !session?.config?.readOnly })

const SessionSettingsMenu = () => {
    const { session } = useGState("Session").online

    return (
        <SubMenuWrap>
            <MenuItem
                text={
                    <FormattedMessage id="Menu.General.Session.Config.ReadOnly" />
                }
                onClick={onClickReadOnly(session)}
                icon={session?.config?.readOnly && <TickIcon />}
            />
        </SubMenuWrap>
    )
}
export default SessionSettingsMenu
