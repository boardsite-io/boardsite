import React from "react"
import { HashRouter, Route } from "react-router-dom"

import Whiteboard from "../view/whiteboard"

export default (
    <HashRouter>
        <Route exact path="/" component={Whiteboard} />
        <Route exact path="/b/:sid" component={Whiteboard} />
    </HashRouter>
)
