import { FormattedMessage } from "language"
import { Tool } from "drawing/stroke/index.types"
import {
    IconButton,
    MinusIcon,
    PlusIcon,
    Popup,
    Position,
    ToolTip,
} from "components"
import React, { useState } from "react"
import {
    REPLACE_FAVORITE_TOOL,
    REMOVE_FAVORITE_TOOL,
} from "redux/drawing/drawing"
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
        store.dispatch(REPLACE_FAVORITE_TOOL(index))
    }

    const removeTool = () => {
        store.dispatch(REMOVE_FAVORITE_TOOL(index))
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
            <ToolTip
                text={<FormattedMessage id="Favorite.Select" />}
                position={Position.Right}>
                <IconButton
                    background={tool.style.color}
                    onMouseDown={startClick}
                    onMouseUp={endClick}
                    onTouchStart={startClick}
                    onTouchEnd={endClick}>
                    {children}
                </IconButton>
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <FavToolOptions>
                    <ToolTip
                        text={<FormattedMessage id="Favorite.Replace" />}
                        position={Position.BottomRight}>
                        <IconButton onClick={replaceTool}>
                            <PlusIcon />
                        </IconButton>
                    </ToolTip>
                    <ToolTip
                        text={<FormattedMessage id="Favorite.Remove" />}
                        position={Position.Right}>
                        <IconButton onClick={removeTool}>
                            <MinusIcon />
                        </IconButton>
                    </ToolTip>
                </FavToolOptions>
            </Popup>
            <FavToolWidth>{tool.style.width}</FavToolWidth>
        </FavToolWrapper>
    )
}

export default FavToolButton