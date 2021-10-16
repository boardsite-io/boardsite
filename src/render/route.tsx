import React from "react"
import { HashRouter, Route } from "react-router-dom"
import isElectron from "is-electron"
import Whiteboard from "../view/whiteboard"

export default isElectron() ? (
    <HashRouter>
        <Route exact path="/" component={Whiteboard} />
        <Route exact path="/b/:sid" component={Whiteboard} />
    </HashRouter>
) : (
    <Route>
        <Route exact path="/" component={Whiteboard} />
        <Route exact path="/b/:sid" component={Whiteboard} />
    </Route>
)
