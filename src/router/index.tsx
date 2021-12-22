import React from "react"
import { BrowserRouter } from "react-router-dom"
import ElectronWrapper from "./electron"
import Routes from "./routes"

const Router = (): JSX.Element => (
    <BrowserRouter>
        <ElectronWrapper>
            <Routes />
        </ElectronWrapper>
    </BrowserRouter>
)

export default Router
