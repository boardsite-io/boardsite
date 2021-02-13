import React from "react"
import ViewNavigation from "./menucomponents/viewnavigation"
import ViewZoom from "./menucomponents/viewzoom"
import ViewOptions from "./menucomponents/viewoptions"

export default function Viewbar() {
    return (
        <div className="viewbar">
            <ViewNavigation />
            <ViewZoom />
            <ViewOptions />
        </div>
    )
}
