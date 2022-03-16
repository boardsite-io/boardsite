import { TextField } from "components"
import { MAX_ALIAS_LENGTH } from "consts"
import { getRandomColor } from "helpers"
import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { online } from "state/online"
import { useGState } from "state"
import { ColorButton, Selection } from "./index.styled"

export const UserSelection = () => {
    const { alias, color } = useGState("UserSelection").online.userSelection

    const handleAliasChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            online.updateUser({ alias: e.target.value })
        },
        []
    )

    const newRandomColor = useCallback(() => {
        online.updateUser({ color: getRandomColor() })
    }, [])

    return (
        <Selection>
            <ColorButton
                type="button"
                $color={color}
                onClick={newRandomColor}
            />
            <TextField
                value={alias}
                label={<FormattedMessage id="UserSelection.ChooseAlias" />}
                onChange={handleAliasChange}
                maxLength={MAX_ALIAS_LENGTH}
                align="left"
            />
        </Selection>
    )
}
