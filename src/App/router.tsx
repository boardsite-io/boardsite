import React from "react"
import { Route, Routes as RouterRoutes, Navigate } from "react-router-dom"
import View from "View"
import Callback from "View/Oauth2"
import { ROUTE } from "./routes"

const Routes = (): JSX.Element => (
    <RouterRoutes>
        <Route path={ROUTE.HOME} element={<View />} />
        <Route path={ROUTE.SESSION} element={<View />} />
        <Route path={ROUTE.AUTH_CALLBACK} element={<Callback />} />
        <Route path="*" element={<Navigate to={ROUTE.HOME} />} />
    </RouterRoutes>
)

export default Routes
