import React from "react"
import { Route, Routes as RouterRoutes, Navigate } from "react-router-dom"
import View from "View"
import Callback from "View/Authorize"
import { AUTH_CALLBACK } from "api/auth"

const Routes = (): JSX.Element => (
    <RouterRoutes>
        <Route path="/" element={<View />} />
        <Route path="/b/:sid" element={<View />} />
        <Route path={AUTH_CALLBACK} element={<Callback />} />
        <Route path="*" element={<Navigate to="/" />} />
    </RouterRoutes>
)

export default Routes
