import React from "react"
import { HashRouter, Route } from "react-router-dom"
import isElectron from "is-electron"
import Whiteboard from "../view/whiteboard"

const Router = isElectron() ? HashRouter : Route

export default (
    <Router>
        <Route exact path="/" component={Whiteboard} />
        <Route exact path="/b/:sid" component={Whiteboard} />
    </Router>
)
