import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Theme } from "theme.styled"
import Router from "./router"
import store from "./redux/store"

// ========================================

ReactDOM.render(
    <Theme>
        <Provider store={store}>
            <Router />
        </Provider>{" "}
    </Theme>,
    document.getElementById("root")
)
