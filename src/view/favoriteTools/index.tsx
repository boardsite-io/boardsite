import { FormattedMessage } from "language"
import { nanoid } from "@reduxjs/toolkit"
import React from "react"
import { IconButton, PlusIcon, ToolTip, Position, ToolIcons } from "components"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { ADD_FAVORITE_TOOL } from "redux/drawing/drawing"
import { RootState } from "redux/types"
import { FavToolsStyled } from "./index.styled"
import FavToolButton from "./favtoolbutton/favtoolbutton"

// add current draw settings as new fav tool
const addFavoriteTool = () => {
    store.dispatch(ADD_FAVORITE_TOOL())
}

const FavoriteTools: React.FC = () => {
    const favoriteTools = useCustomSelector(
        (state: RootState) => state.drawing.favoriteTools
    )

    return (
        <FavToolsStyled>
            {favoriteTools.map((tool, i) => {
                const ToolIcon = ToolIcons[tool.type]

                return (
                    <FavToolButton key={nanoid()} tool={tool} index={i}>
                        <ToolIcon />
                    </FavToolButton>
                )
            })}
            <ToolTip
                text={<FormattedMessage id="Favorite.Add" />}
                position={Position.Right}>
                <IconButton onClick={addFavoriteTool}>
                    <PlusIcon />
                </IconButton>
            </ToolTip>
        </FavToolsStyled>
    )
}

export default FavoriteTools