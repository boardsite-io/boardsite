import React from "react"
import { useCustomSelector } from "redux/hooks"
import { EraserIcon, IconButton, PanIcon, SelectIcon } from "components"
import store from "redux/store"
import { ToolType } from "redux/drawing/drawing.types"
import PenTool from "../pentool/pentool"

const ToolRing: React.FC = () => {
    const typeSelector = useCustomSelector(
        (state) => state.drawing.liveStroke.type
    )

    return (
        <>
            <PenTool />
            <IconButton
                active={typeSelector === ToolType.Eraser}
                onClick={() => {
                    store.dispatch({
                        type: "SET_TYPE",
                        payload: ToolType.Eraser,
                    })
                }}>
                <EraserIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Select}
                onClick={() => {
                    store.dispatch({
                        type: "SET_TYPE",
                        payload: ToolType.Select,
                    })
                }}>
                <SelectIcon />
            </IconButton>
            <IconButton
                active={typeSelector === ToolType.Pan}
                onClick={() => {
                    store.dispatch({
                        type: "SET_TYPE",
                        payload: ToolType.Pan,
                    })
                }}>
                <PanIcon />
            </IconButton>
        </>
    )
}

export default ToolRing
