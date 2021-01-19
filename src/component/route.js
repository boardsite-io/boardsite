import React from "react"
import { Route } from "react-router-dom"

import WhiteboardControl from "../page/whiteboardcontrol"

export default (
    <Route>
        <Route exact path="/" component={WhiteboardControl} />
        <Route exact path="/s=:id" component={WhiteboardControl} />
    </Route>
)
