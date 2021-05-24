import React, { useState } from "react"
import "../../../css/menucomponents/pageoptions.css"
import { FiMinus, FiPlus } from "react-icons/fi"
import {
    REPLACE_FAV_TOOL,
    REMOVE_FAV_TOOL,
    SET_TOOL,
} from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"
import { Tool } from "../../../types"

interface FavToolButtonProps {
    icon: JSX.Element | undefined
    tool: Tool
    index: number
}

export default function FavToolButton({
    icon,
    tool,
    index,
}: FavToolButtonProps): JSX.Element {
    const [open, setOpen] = useState(false)

    // apply fav tool as setting
    function setTool(toolToSet: Tool) {
        store.dispatch(SET_TOOL(toolToSet))
    }

    function replaceTool() {
        store.dispatch(REPLACE_FAV_TOOL(index))
    }

    function removeTool() {
        store.dispatch(REMOVE_FAV_TOOL(index))
    }

    let clickActive = false
    let timeoutActive = false

    function startClick() {
        clickActive = true
        timeoutActive = true
        setTimeout(() => {
            if (clickActive) {
                setOpen(true)
            }
            timeoutActive = false
        }, 300)
    }

    function endClick() {
        if (timeoutActive) {
            setTool(tool)
            timeoutActive = false
        }
        clickActive = false
    }

    return (
        <div className="favtoolbox">
            <button
                type="button"
                className="favtool"
                style={{ background: tool.style.color }}
                onMouseDown={startClick}
                onMouseUp={endClick}
                onTouchStart={startClick}
                onTouchEnd={endClick}>
                {icon}
            </button>
            {
                // Palette Popup
                open ? (
                    <div className="popup">
                        <div
                            role="button"
                            tabIndex={0}
                            className="cover"
                            onClick={() => setOpen(false)}
                        />
                        <div className="favtooloptions">
                            <button
                                type="button"
                                id="icon-button"
                                onClick={replaceTool}>
                                <FiPlus id="icon" />
                            </button>
                            <button
                                type="button"
                                id="icon-button"
                                onClick={removeTool}>
                                <FiMinus id="icon" />
                            </button>
                        </div>
                    </div>
                ) : null
            }
            <div className="favtool-width">{tool.style.width}</div>
        </div>
    )
}
