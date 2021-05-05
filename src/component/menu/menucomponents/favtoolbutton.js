import React, { useState } from "react"
import { useLongPress } from "react-use"
import "../../../css/menucomponents/pageoptions.css"
import { FiMinus, FiPlus } from "react-icons/fi"
import {
    REPLACE_FAV_TOOL,
    REMOVE_FAV_TOOL,
    SET_TOOL,
} from "../../../redux/slice/drawcontrol"
import store from "../../../redux/store"

export default function FavToolButton({ icon, tool, index }) {
    const [open, setOpen] = useState(false)

    // apply fav tool as setting
    function setTool(toolToSet) {
        store.dispatch(SET_TOOL(toolToSet))
    }

    function replaceTool() {
        store.dispatch(REPLACE_FAV_TOOL(index))
    }

    function removeTool() {
        store.dispatch(REMOVE_FAV_TOOL(index))
    }

    const defaultOptions = {
        isPreventDefault: true,
        delay: 300,
    }
    const onLongPress = () => {
        setOpen(true)
    }
    const longPressEvent = useLongPress(onLongPress, defaultOptions)

    return (
        <div className="favtoolbox">
            <button
                {...longPressEvent}
                type="button"
                className="favtool"
                style={{ background: tool.style.color }}
                onClick={() => setTool(tool)}>
                {icon}
            </button>
            {
                // Palette Popup
                open ? (
                    <div className="popup">
                        <div
                            role="button"
                            tabIndex="0"
                            className="cover"
                            onClick={() => setOpen(false)}
                            onKeyPress={() => {}}
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
