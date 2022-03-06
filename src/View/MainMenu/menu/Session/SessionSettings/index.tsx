import React from "react"
import { TickIcon } from "components"
import { Session } from "api/types"
import { useOnline } from "state/online"
import { FormattedMessage } from "language"
import { SubMenuWrap } from "../../../index.styled"
import MenuItem from "../../../MenuItem"

const onClickReadOnly = (session: Session | undefined) => () =>
    session?.updateConfig({ readOnly: !session?.config?.readOnly })

const SessionSettingsMenu = () => {
    const { session } = useOnline()

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
