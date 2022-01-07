import { nanoid } from "@reduxjs/toolkit"
import React from "react"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    PlusIcon,
    RectangleIcon,
    ToolTip,
    Position,
} from "components"
import { ToolType } from "drawing/stroke/index.types"
import store from "redux/store"
import { useCustomSelector } from "hooks"
import { ADD_FAV_TOOL } from "redux/drawing/drawing"
import { RootState } from "redux/types"
import { ToolTipText } from "language"
import { FavToolsStyled } from "./favtools.styled"
import FavToolButton from "./favtoolbutton/favtoolbutton"

const FavTools: React.FC = () => {
    const favTools = useCustomSelector(
        (state: RootState) => state.drawing.favTools
    )

    // add current draw settings as new fav tool
    const addFavTool = () => {
        store.dispatch(ADD_FAV_TOOL())
    }

    return (
        <FavToolsStyled>
            {favTools.map((tool, i) => {
                let icon
                switch (tool.type) {
                    case ToolType.Pen:
                        icon = <PenIcon />
                        break
                    case ToolType.Line:
                        icon = <LineIcon />
                        break
                    case ToolType.Rectangle:
                        icon = <RectangleIcon />
                        break
                    case ToolType.Circle:
                        icon = <CircleIcon />
                        break
                    default:
                        icon = <PenIcon />
                        break
                }

                return (
                    <FavToolButton key={nanoid()} tool={tool} index={i}>
                        {icon}
                    </FavToolButton>
                )
            })}
            <ToolTip
                text={ToolTipText.AddFavoriteTool}
                position={Position.Right}>
                <IconButton onClick={addFavTool}>
                    <PlusIcon />
                </IconButton>
            </ToolTip>
        </FavToolsStyled>
    )
}

export default FavTools
