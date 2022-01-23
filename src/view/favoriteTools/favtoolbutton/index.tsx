import { FormattedMessage } from "language"
import { Tool } from "drawing/stroke/index.types"
import {
    IconButton,
    MinusIcon,
    PlusIcon,
    Popup,
    Position,
    ToolButton,
    ToolTip,
} from "components"
import React, { useState } from "react"
import {
    REPLACE_FAVORITE_TOOL,
    REMOVE_FAVORITE_TOOL,
} from "redux/drawing/drawing"
import store from "redux/store"
import { handleSetTool } from "drawing/handlers"
import { FavToolOptions, FavToolWrapper } from "./index.styled"

interface FavToolButtonProps {
    icon: JSX.Element
    tool: Tool
    index: number
}

const FavToolButton: React.FC<FavToolButtonProps> = ({ icon, tool, index }) => {
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
                position={Position.Right}
            >
                <ToolButton
                    icon={icon}
                    toolColor={tool.style.color}
                    toolWidth={tool.style.width}
                    onMouseDown={startClick}
                    onMouseUp={endClick}
                    onTouchStart={startClick}
                    onTouchEnd={endClick}
                />
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <FavToolOptions>
                    <ToolTip
                        text={<FormattedMessage id="Favorite.Replace" />}
                        position={Position.BottomRight}
                    >
                        <IconButton icon={<PlusIcon />} onClick={replaceTool} />
                    </ToolTip>
                    <ToolTip
                        text={<FormattedMessage id="Favorite.Remove" />}
                        position={Position.Right}
                    >
                        <IconButton icon={<MinusIcon />} onClick={removeTool} />
                    </ToolTip>
                </FavToolOptions>
            </Popup>
        </FavToolWrapper>
    )
}

export default FavToolButton
