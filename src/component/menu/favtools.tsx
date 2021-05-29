import { nanoid } from "@reduxjs/toolkit"
import React from "react"
import { BsPencil } from "react-icons/bs"
import { CgController, CgErase } from "react-icons/cg"
import { FiCircle, FiMinus, FiPlus, FiSquare } from "react-icons/fi"
import { ADD_FAV_TOOL } from "../../redux/slice/drawcontrol"
import store from "../../redux/store"
import { useCustomSelector } from "../../redux/hooks"
import FavToolButton from "./menucomponents/favtoolbutton"
import { ToolType } from "../../types"

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
                    case ToolType.Pen:
                        icon = <BsPencil id="icon" />
                        break
                    case ToolType.Eraser:
                        icon = <CgErase id="icon" />
                        break
                    case ToolType.Drag:
                        icon = <CgController id="icon" />
                        break
                    case ToolType.Line:
                        icon = <FiMinus id="icon" />
                        break
                    case ToolType.Rectangle:
                        icon = <FiSquare id="icon" />
                        break
                    // case ToolType.TRIANGLE:
                    //     icon = <FiTriangle id="icon" />
                    //     break
                    case ToolType.Circle:
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
