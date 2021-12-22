import React from "react"
import isElectron from "is-electron"
import { HashRouter } from "react-router-dom"

interface ElectronWrapperProps {
    children: JSX.Element
}

const ElectronWrapper = ({ children }: ElectronWrapperProps): JSX.Element => {
    if (isElectron()) {
        return <HashRouter>{children}</HashRouter>
    }
    return children
}

export default ElectronWrapper
