import React from "react"
import { FormattedMessage, IntlMessageId } from "language"
import { Item, Keys, Title } from "./index.styled"

interface ShortcutProps {
    titleId: IntlMessageId
    keysId: IntlMessageId
}

const Shortcut: React.FC<ShortcutProps> = ({ titleId, keysId }) => {
    return (
        <Item>
            <Title>
                <FormattedMessage id={titleId} />
            </Title>
            <Keys>
                <FormattedMessage id={keysId} />
            </Keys>
        </Item>
    )
}

export default Shortcut
