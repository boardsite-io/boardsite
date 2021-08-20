import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import "./css/theme.css"
import "./css/buttons.css"

import routes from "./component/route"

import store from "./redux/store"

function Boardsite() {
    return <Router>{routes}</Router>
}

// ========================================

ReactDOM.render(
    <Provider store={store}>
        <Boardsite />
    </Provider>,
    document.getElementById("root")
)
