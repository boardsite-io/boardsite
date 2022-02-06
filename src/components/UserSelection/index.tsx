import { FormattedMessage } from "language"
import React, { useState } from "react"
import { MAX_ALIAS_LENGTH } from "consts"
import { currentSession } from "api/session"
import { getRandomColor } from "helpers"
import { ColorButton, Selection } from "./index.styled"
// Dont import from components to prevent dependency cycle
import TextField from "../TextField"

const UserSelection: React.FC = () => {
    const [, triggerRender] = useState<boolean>(true)
    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        currentSession().updateUser({ alias: e.target.value })
        triggerRender((x) => !x)
    }

    const newRandomColor = () => {
        currentSession().updateUser({ color: getRandomColor() })
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
                label={
                    <FormattedMessage id="UserSelection.TextFieldLabel.ChooseAlias" />
                }
                onChange={handleAliasChange}
                maxLength={MAX_ALIAS_LENGTH}
                align="left"
            />
        </Selection>
    )
}

export default UserSelection
