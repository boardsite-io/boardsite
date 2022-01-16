import React from "react"
import Konva from "konva"
import { currentSession } from "api/session"
import { ColorButton, Selection } from "./index.styled"
// Dont import from components to prevent dependency cycle
import TextField from "../textfield"

const UserSelection: React.FC = () => {
    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        currentSession().updateUser({ alias: e.target.value })
    }

    const newRandomColor = () => {
        currentSession().updateUser({ color: Konva.Util.getRandomColor() })
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
                label="Choose alias"
                onChange={handleAliasChange}
                maxLength={20}
                align="left"
            />
        </Selection>
    )
}

export default UserSelection
