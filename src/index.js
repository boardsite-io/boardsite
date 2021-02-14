import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"

import CssBaseline from "@material-ui/core/CssBaseline"
import "./css/theme.css"
import "./css/index.css"
import "./css/whiteboard.css"
import "./css/menubars.css"
import "./css/buttons.css"
import "./css/menucomponents/popup.css"

import routes from "./component/route"

import store from "./redux/store"

function Boardsite() {
    return (
        <div className="rootdiv">
            <CssBaseline />
            <Router>{routes}</Router>
        </div>
    )
}

// ========================================

ReactDOM.render(
    <Provider store={store}>
        <Boardsite />
    </Provider>,
    document.getElementById("root")
)
