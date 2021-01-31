import React from "react"
import { useSelector } from "react-redux"
import { StrokeShape } from "./stroke"

export default function Page({ pageId }) {
    // console.log("Page Redraw")
    const strokes = useSelector(
        (state) => state.boardControl.present.pageCollection[pageId].strokes
    )

    return (
        <>
            {Object.keys(strokes).map((id) => (
                <StrokeShape key={id} {...strokes[id]} />
            ))}
        </>
    )
}
