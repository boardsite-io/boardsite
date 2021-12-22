import React from "react"
import { Route, Routes as RouterRoutes, Navigate } from "react-router-dom"
import Whiteboard from "view/whiteboard"

const Routes = (): JSX.Element => (
    <RouterRoutes>
        <Route path="/" element={<Whiteboard />} />
        <Route path="/b/:sid" element={<Whiteboard />} />
        <Route path="*" element={<Navigate to="/" />} />
    </RouterRoutes>
)

export default Routes
