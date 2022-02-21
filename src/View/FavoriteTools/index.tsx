import { FormattedMessage } from "language"
import { nanoid } from "nanoid"
import React from "react"
import { IconButton, PlusIcon, ToolTip, Position, ToolIcons } from "components"
import { MAX_FAVORITE_TOOLS } from "consts"
import { drawing, useDrawing } from "state/drawing"
import { FavToolsStyled } from "./index.styled"
import FavToolButton from "./FavoriteToolButton"

// add current draw settings as new fav tool
const addFavoriteTool = () => {
    drawing.addFavoriteTool()
}

const FavoriteTools: React.FC = () => {
    const { favoriteTools } = useDrawing("FavoriteTools")

    return (
        <FavToolsStyled>
            {favoriteTools.map((tool, i) => {
                const ToolIcon = ToolIcons[tool.type]

                return (
                    <FavToolButton
                        key={nanoid()}
                        tool={tool}
                        index={i}
                        icon={<ToolIcon />}
                    />
                )
            })}
            {favoriteTools.length < MAX_FAVORITE_TOOLS && (
                <ToolTip
                    text={<FormattedMessage id="Favorite.Add" />}
                    position={Position.TopLeft}
                >
                    <IconButton icon={<PlusIcon />} onClick={addFavoriteTool} />
                </ToolTip>
            )}
        </FavToolsStyled>
    )
}

export default FavoriteTools
