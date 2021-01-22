import React from "react"
import { Route } from "react-router-dom"

import Whiteboard from "../view/whiteboard.js"

export default (
    <Route>
        <Route exact path="/" component={Whiteboard} />
        <Route exact path="/s=:id" component={Whiteboard} />
    </Route>
)
