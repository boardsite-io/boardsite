import React from "react"
import { BsPencil } from "react-icons/bs"
import { CgController, CgErase } from "react-icons/cg"
import { FiCircle, FiMinus, FiPlus, FiSquare, FiTriangle } from "react-icons/fi"
import { IoShapesOutline } from "react-icons/io5"
import { useSelector } from "react-redux"
import { toolType } from "../../constants"
import { ADD_FAV_TOOL, SET_TOOL } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"

function FavTools() {
    const favTools = useSelector((state) => state.drawControl.favTools)

    // apply fav tool as setting
    function setTool(tool) {
        store.dispatch(SET_TOOL(tool))
    }

    // add current draw settings as new fav tool
    function addFavTool() {
        store.dispatch(ADD_FAV_TOOL())
    }

    return (
        <div className="favtools">
            {favTools.map((tool) => {
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
                        icon = <IoShapesOutline id="icon" />
                        break
                }
                return (
                    <div className="favtoolbox">
                        <button
                            type="button"
                            className="favtool"
                            style={{ background: tool.style.color }}
                            onClick={() => setTool(tool)}>
                            {icon}
                        </button>
                        <div className="favtool-width">{tool.style.width}</div>
                    </div>
                )
            })}
            <button
                type="button"
                id="icon-button"
                // style={{ background: "#333333" }}
                onClick={addFavTool}>
                <FiPlus id="icon" />
            </button>
        </div>
    )
}
export default FavTools
