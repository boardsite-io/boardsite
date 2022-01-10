import React, { memo, useState } from "react"
import Konva from "konva"
import { MAX_ALIAS_LENGTH } from "consts"
import { currentSession } from "api/session"
import { FormattedMessage } from "language"
import { ColorButton, Selection } from "./index.styled"
// Dont import from components to prevent dependency cycle
import TextField from "../textfield/textfield"

const UserSelection: React.FC = memo(() => {
    const [, triggerRender] = useState(false)

    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const alias = e.target.value
        currentSession().updateUser({ alias })
        triggerRender((x) => !x)
    }

    const newRandomColor = () => {
        currentSession().updateUser({ color: Konva.Util.getRandomColor() })
        triggerRender((x) => !x)
    }

    return (
        <Selection>
            <ColorButton
                type="button"
                $color={currentSession().user.color}
                onClick={newRandomColor}
            />
            <TextField
                value={currentSession().user.alias}
                label={<FormattedMessage id="UserSelection.AliasInputLabel" />}
                onChange={handleAliasChange}
                maxLength={MAX_ALIAS_LENGTH}
                align="left"
            />
        </Selection>
    )
})

export default UserSelection
