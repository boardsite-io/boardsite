import React from "react"
import { StrokeShape } from "./stroke"

export default function Page(props) {
    // console.log("Page Redraw");

    const pageCollection = props.pageCollection[props.pageId]

    return Object.keys(pageCollection.strokes).map((strokeId) => (
        <StrokeShape
            key={strokeId}
            stroke={pageCollection.strokes[strokeId]}
            isDraggable={props.isDraggable}
        />
    ))
}
