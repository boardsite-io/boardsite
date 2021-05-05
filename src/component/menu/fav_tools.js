import React from "react"
import { useLongPress } from "react-use"
import { nanoid } from "@reduxjs/toolkit"
import { BsPencil } from "react-icons/bs"
import { CgController, CgErase } from "react-icons/cg"
import { FiCircle, FiMinus, FiPlus, FiSquare, FiTriangle } from "react-icons/fi"
import { useSelector } from "react-redux"
import { toolType } from "../../constants"
import {
    ADD_FAV_TOOL,
    REPLACE_FAV_TOOL,
    SET_TOOL,
} from "../../redux/slice/drawcontrol"
import store from "../../redux/store"

function FavTools() {
    const favTools = useSelector((state) => state.drawControl.favTools)

    // add current draw settings as new fav tool
    function addFavTool() {
        store.dispatch(ADD_FAV_TOOL())
    }

    return (
        <div className="favtools">
            {favTools.map((tool, i) => {
                let icon
                // let style = { color: colorSelector }
                switch (tool.type) {
                    case toolType.PEN:
                        icon = <BsPencil id="icon" />
                        break
                    case toolType.ERASER:
                        icon = <CgErase id="icon" />
                        break
                    case toolType.DRAG:
                        icon = <CgController id="icon" />
                        break
                    case toolType.LINE:
                        icon = <FiMinus id="icon" />
                        break
                    case toolType.RECTANGLE:
                        icon = <FiSquare id="icon" />
                        break
                    case toolType.TRIANGLE:
                        icon = <FiTriangle id="icon" />
                        break
                    case toolType.CIRCLE:
                        icon = <FiCircle id="icon" />
                        break
                    default:
                        break
                }

                return (
                    <div className="favtoolbox" key={nanoid()}>
                        <FavToolButton icon={icon} tool={tool} index={i} />
                        <div className="favtool-width">{tool.style.width}</div>
                    </div>
                )
            })}
            <button type="button" id="icon-button" onClick={addFavTool}>
                <FiPlus id="icon" />
            </button>
        </div>
    )
}

function FavToolButton({ icon, tool, index }) {
    // apply fav tool as setting
    function setTool(toolToSet) {
        store.dispatch(SET_TOOL(toolToSet))
    }

    const defaultOptions = {
        isPreventDefault: true,
        delay: 300,
    }
    const onLongPress = () => {
        console.log(tool, index)
        store.dispatch(REPLACE_FAV_TOOL(index))
    }
    const longPressEvent = useLongPress(onLongPress, defaultOptions)

    return (
        <button
            {...longPressEvent}
            type="button"
            className="favtool"
            style={{ background: tool.style.color }}
            onClick={() => setTool(tool)}>
            {icon}
        </button>
    )
}

export default FavTools
