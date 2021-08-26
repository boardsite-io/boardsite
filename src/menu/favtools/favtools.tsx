import { nanoid } from "@reduxjs/toolkit"
import React from "react"
import { BsPencil } from "react-icons/bs"
import { CgErase } from "react-icons/cg"
import { FiCircle, FiMinus, FiPlus, FiSquare } from "react-icons/fi"
import { IconButton } from "components"
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
                        icon = <BsPencil id="icon" />
                        break
                    case ToolType.Eraser:
                        icon = <CgErase id="icon" />
                        break
                    case ToolType.Line:
                        icon = <FiMinus id="icon" />
                        break
                    case ToolType.Rectangle:
                        icon = <FiSquare id="icon" />
                        break
                    case ToolType.Circle:
                        icon = <FiCircle id="icon" />
                        break
                    default:
                        return null
                }

                return (
                    <FavToolButton
                        icon={icon}
                        tool={tool}
                        index={i}
                        key={nanoid()}
                    />
                )
            })}
            <IconButton onClick={addFavTool}>
                <FiPlus id="icon" />
            </IconButton>
        </FavToolsStyled>
    )
}

export default FavTools
