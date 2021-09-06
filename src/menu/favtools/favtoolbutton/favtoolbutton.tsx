import { Popup } from "components"
import React, { useState } from "react"
import { FiMinus, FiPlus } from "react-icons/fi"
import IconButton from "../../../components/iconbutton/iconbutton"
import {
    REPLACE_FAV_TOOL,
    REMOVE_FAV_TOOL,
    SET_TOOL,
} from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import { Tool } from "../../../types"
import {
    FavToolOptions,
    FavToolWidth,
    FavToolWrapper,
} from "./favtoolbutton.styled"

interface FavToolButtonProps {
    icon: JSX.Element
    tool: Tool
    index: number
}

const FavToolButton: React.FC<FavToolButtonProps> = ({ icon, tool, index }) => {
    const [open, setOpen] = useState(false)

    // apply fav tool as setting
    const setTool = (toolToSet: Tool) => {
        store.dispatch(SET_TOOL(toolToSet))
    }

    const replaceTool = () => {
        store.dispatch(REPLACE_FAV_TOOL(index))
    }

    const removeTool = () => {
        store.dispatch(REMOVE_FAV_TOOL(index))
    }

    let clickActive = false
    let timeoutActive = false

    const startClick = () => {
        clickActive = true
        timeoutActive = true
        setTimeout(() => {
            if (clickActive) {
                setOpen(true)
            }
            timeoutActive = false
        }, 300)
    }

    const endClick = () => {
        if (timeoutActive) {
            setTool(tool)
            timeoutActive = false
        }
        clickActive = false
    }

    return (
        <FavToolWrapper>
            <IconButton
                background={tool.style.color}
                onMouseDown={startClick}
                onMouseUp={endClick}
                onTouchStart={startClick}
                onTouchEnd={endClick}>
                {icon}
            </IconButton>
            <Popup open={open} onClose={() => setOpen(false)}>
                <FavToolOptions>
                    <IconButton onClick={replaceTool}>
                        <FiPlus id="icon" />
                    </IconButton>
                    <IconButton onClick={removeTool}>
                        <FiMinus id="icon" />
                    </IconButton>
                </FavToolOptions>
            </Popup>
            <FavToolWidth>{tool.style.width}</FavToolWidth>
        </FavToolWrapper>
    )
}

export default FavToolButton
