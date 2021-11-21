import { Tool } from "drawing/stroke/types"
import { IconButton, MinusIcon, PlusIcon, Popup } from "components"
import React, { useState } from "react"
import { REPLACE_FAV_TOOL, REMOVE_FAV_TOOL } from "redux/drawing/drawing"
import store from "redux/store"
import { handleSetTool } from "drawing/handlers"
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
            handleSetTool(tool)
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
