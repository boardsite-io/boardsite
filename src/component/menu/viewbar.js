import React from "react"
import ViewNavigation from "./menucomponents/viewnavigation"
import ViewZoom from "./menucomponents/viewzoom"
import ViewOptions from "./menucomponents/viewoptions"
import AllPagesOptions from "./menucomponents/allpagesoptions"
import PageOptions from "./menucomponents/pageoptions"

export default function Viewbar() {
    return (
        <div className="viewbar">
            <AllPagesOptions />
            <ViewNavigation />
            <PageOptions />
            <ViewZoom />
            <ViewOptions />
        </div>
    )
}
