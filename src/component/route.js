import React from "react"
import { Route } from "react-router-dom"

import Whiteboard from "../view/whiteboard"

export default (
    <Route>
        <Route exact path="/" component={Whiteboard} />
        <Route exact path="/b/:sid" component={Whiteboard} />
    </Route>
)
