import React from "react"
import { TickIcon } from "components"
import { Session } from "api/types"
import { useOnline } from "state/online"
import { SubMenuWrap } from "../../index.styled"
import MenuItem from "../../MenuItem"

const onClickReadOnly = (session: Session | undefined) => () =>
    session?.updateConfig({ readOnly: !session?.config?.readOnly })

const SessionSettingsMenu = () => {
    const { session } = useOnline()

    return (
        <SubMenuWrap level={2}>
            <MenuItem
                text="Read only"
                onClick={onClickReadOnly(session)}
                icon={session?.config?.readOnly ? <TickIcon /> : undefined}
            />
        </SubMenuWrap>
    )
}
export default SessionSettingsMenu
