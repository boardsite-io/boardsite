import { Tool } from "redux/drawing/drawing.types"
import { IconButton, MinusIcon, PlusIcon, Popup } from "components"
import React, { useState } from "react"
import store from "redux/store"
import {
    FavToolOptions,
    FavToolWidth,
    FavToolWrapper,
} from "./favtoolbutton.styled"

interface FavToolButtonProps {
    children: JSX.Element
    tool: Tool
    index: number
}

const FavToolButton: React.FC<FavToolButtonProps> = ({
    children,
    tool,
    index,
}) => {
    const [open, setOpen] = useState(false)

    // apply fav tool as setting
    const setTool = (toolToSet: Tool) => {
        store.dispatch({
            type: "SET_TOOL",
            payload: toolToSet,
        })
    }

    const replaceTool = () => {
        store.dispatch({
            type: "REPLACE_FAV_TOOL",
            payload: index,
        })
    }

    const removeTool = () => {
        store.dispatch({
            type: "REMOVE_FAV_TOOL",
            payload: index,
        })
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
                {children}
            </IconButton>
            <Popup open={open} onClose={() => setOpen(false)}>
                <FavToolOptions>
                    <IconButton onClick={replaceTool}>
                        <PlusIcon />
                    </IconButton>
                    <IconButton onClick={removeTool}>
                        <MinusIcon />
                    </IconButton>
                </FavToolOptions>
            </Popup>
            <FavToolWidth>{tool.style.width}</FavToolWidth>
        </FavToolWrapper>
    )
}

export default FavToolButton
