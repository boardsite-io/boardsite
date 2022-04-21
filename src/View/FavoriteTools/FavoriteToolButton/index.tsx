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
import React, { useCallback, useState } from "react"
import { handleSetTool } from "drawing/handlers"
import { drawing } from "state/drawing"
import { FavToolOptions, FavToolWrapper } from "./index.styled"

interface FavToolButtonProps {
    icon: JSX.Element
    tool: Tool
    index: number
}

let clickActive = false

const FavToolButton: React.FC<FavToolButtonProps> = ({ icon, tool, index }) => {
    const [open, setOpen] = useState(false)

    const replaceTool = useCallback(() => {
        drawing.replaceFavoriteTool(index)
    }, [index])

    const removeTool = useCallback(() => {
        drawing.removeFavoriteTool(index)
    }, [index])

    const startClick = useCallback(() => {
        clickActive = true
        setTimeout(() => {
            if (clickActive) {
                setOpen(true)
            }
        }, 300)
    }, [])

    const endClick = useCallback(() => {
        clickActive = false
    }, [])

    const click = useCallback(() => {
        handleSetTool(tool)
    }, [tool])

    return (
        <FavToolWrapper>
            <ToolTip
                text={<FormattedMessage id="ToolTip.SelectFavoriteTool" />}
                position={Position.Right}
            >
                <ToolButton
                    aria-label="Favorite tool"
                    icon={icon}
                    toolColor={tool.style.color}
                    toolWidth={tool.style.width}
                    onClick={click}
                    onMouseDown={startClick}
                    onMouseUp={endClick}
                    onTouchStart={startClick}
                    onTouchEnd={endClick}
                />
            </ToolTip>
            <Popup open={open} onClose={() => setOpen(false)}>
                <FavToolOptions>
                    <ToolTip
                        text={
                            <FormattedMessage id="ToolTip.ReplaceFavoriteTool" />
                        }
                        position={Position.TopRight}
                    >
                        <IconButton
                            aria-label="Replace favorite tool"
                            icon={<PlusIcon />}
                            onClick={replaceTool}
                        />
                    </ToolTip>
                    <ToolTip
                        text={
                            <FormattedMessage id="ToolTip.RemoveFavoriteTool" />
                        }
                        position={Position.TopRight}
                    >
                        <IconButton
                            aria-label="Remove favorite tool"
                            icon={<MinusIcon />}
                            onClick={removeTool}
                        />
                    </ToolTip>
                </FavToolOptions>
            </Popup>
        </FavToolWrapper>
    )
}

export default FavToolButton
