import { nanoid } from "@reduxjs/toolkit"
import React from "react"
import {
    CircleIcon,
    IconButton,
    LineIcon,
    PenIcon,
    PlusIcon,
    SquareIcon,
} from "components"
import { ToolType } from "../../types"
import { FavToolsStyled } from "./favtools.styled"
import store from "../../redux/store"
import { useCustomSelector } from "../../redux/hooks"
import { ADD_FAV_TOOL } from "../../redux/slice/drawcontrol"
import FavToolButton from "./favtoolbutton/favtoolbutton"

const FavTools: React.FC = () => {
    const favTools = useCustomSelector((state) => state.drawControl.favTools)

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
                        icon = <SquareIcon />
                        break
                    case ToolType.Circle:
                        icon = <CircleIcon />
                        break
                    default:
                        icon = <PenIcon />
                        break
                }

                return (
                    <FavToolButton tool={tool} index={i} key={nanoid()}>
                        {icon}
                    </FavToolButton>
                )
            })}
            <IconButton onClick={addFavTool}>
                <PlusIcon />
            </IconButton>
        </FavToolsStyled>
    )
}

export default FavTools
