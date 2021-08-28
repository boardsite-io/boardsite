import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import routes from "./board/route"
import store from "./redux/store"
import "./css/theme.css"

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
