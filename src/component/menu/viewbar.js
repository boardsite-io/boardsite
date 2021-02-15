import React from "react"
import ViewZoom from "./menucomponents/viewzoom"
import ViewOptions from "./menucomponents/viewoptions"
import AllPagesOptions from "./menucomponents/allpagesoptions"
import PageOptions from "./menucomponents/pageoptions"

export default function Viewbar() {
    return (
        <div className="viewbar">
            <AllPagesOptions />
            <PageOptions />
            <ViewZoom />
            <ViewOptions />
        </div>
    )
}
