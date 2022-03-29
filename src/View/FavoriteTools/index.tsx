import { FormattedMessage } from "language"
import { nanoid } from "nanoid"
import React from "react"
import { IconButton, PlusIcon, ToolTip, Position, ToolIcons } from "components"
import { MAX_FAVORITE_TOOLS_FREE } from "consts"
import { useGState } from "state"
import { drawing } from "state/drawing"
import { online } from "state/online"
import { FavToolsStyled } from "./index.styled"
import FavToolButton from "./FavoriteToolButton"

// add current draw settings as new fav tool
const addFavoriteTool = () => {
    drawing.addFavoriteTool()
}

const FavoriteTools: React.FC = () => {
    useGState("Session")
    const { favoriteTools } = useGState("FavoriteTools").drawing
    const canAddFavoriteTool =
        online.isAuthorized() || favoriteTools.length < MAX_FAVORITE_TOOLS_FREE

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
            {canAddFavoriteTool && (
                <ToolTip
                    text={<FormattedMessage id="ToolTip.AddFavoriteTool" />}
                    position={Position.TopLeft}
                >
                    <IconButton icon={<PlusIcon />} onClick={addFavoriteTool} />
                </ToolTip>
            )}
        </FavToolsStyled>
    )
}

export default FavoriteTools
