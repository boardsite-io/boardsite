import React from "react"
import { useSelector } from "react-redux"
import { StrokeShape } from "./stroke"

export default function Page({ pageId, isDraggable, isListening }) {
    // console.log("Page Redraw")
    const strokes = useSelector((state) => {
        if (state.boardControl.present.pageCollection[pageId] !== undefined) {
            return state.boardControl.present.pageCollection[pageId].strokes
        }
        return {}
    })

    return (
        <>
            {Object.keys(strokes).map((id) => (
                <StrokeShape
                    key={id}
                    {...strokes[id]}
                    isDraggable={isDraggable}
                    isListening={isListening}
                />
            ))}
        </>
    )
}
