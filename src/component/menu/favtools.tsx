import { nanoid } from "@reduxjs/toolkit"
import React from "react"
import { BsPencil } from "react-icons/bs"
import { CgController, CgErase } from "react-icons/cg"
import { FiCircle, FiMinus, FiPlus, FiSquare, FiTriangle } from "react-icons/fi"
import { toolType } from "../../constants"
import { ADD_FAV_TOOL } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"
import { useCustomSelector } from "../../redux/hooks"
import FavToolButton from "./menucomponents/favtoolbutton"

const FavTools: React.FC = () => {
    const favTools = useCustomSelector((state) => state.drawControl.favTools)

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
                    <FavToolButton
                        icon={icon}
                        tool={tool}
                        index={i}
                        key={nanoid()}
                    />
                )
            })}
            <button type="button" id="icon-button" onClick={addFavTool}>
                <FiPlus id="icon" />
            </button>
        </div>
    )
}

export default FavTools
