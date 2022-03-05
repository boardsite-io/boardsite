import { FormattedMessage } from "language"
import React, { useState } from "react"
import { MAX_ALIAS_LENGTH } from "consts"
import { getRandomColor } from "helpers"
import { online } from "state/online"
import { ColorButton, Selection } from "./index.styled"
// Dont import from components to prevent dependency cycle
import TextField from "../TextField"

const UserSelection: React.FC = () => {
    const [, triggerRender] = useState<boolean>(true)
    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        online.updateUser({ alias: e.target.value })
        triggerRender((x) => !x)
    }

    const newRandomColor = () => {
        online.updateUser({ color: getRandomColor() })
        triggerRender((x) => !x)
    }

    return (
        <Selection>
            <ColorButton
                type="button"
                $color={online.state.userSelection.color}
                onClick={newRandomColor}
            />
            <TextField
                value={online.state.userSelection.alias}
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
