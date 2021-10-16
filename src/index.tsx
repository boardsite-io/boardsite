import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { Theme } from "theme.styled"
import routes from "./render/route"
import store from "./redux/store"

// ========================================

ReactDOM.render(
    <Theme>
        <Provider store={store}>
            <Router>{routes}</Router>
        </Provider>{" "}
    </Theme>,
    document.getElementById("root")
)
