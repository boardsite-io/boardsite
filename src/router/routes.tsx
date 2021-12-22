import React from "react"
import { Route, Routes as RouterRoutes } from "react-router-dom"
import Whiteboard from "view/whiteboard"

const Routes = (): JSX.Element => (
    <RouterRoutes>
        <Route path="/" element={<Whiteboard />} />
        <Route path="/b/:sid" element={<Whiteboard />} />
    </RouterRoutes>
)

export default Routes
