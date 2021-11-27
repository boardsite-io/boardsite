import React from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import isElectron from "is-electron"
import Whiteboard from "../view/whiteboard"

export default isElectron() ? (
    <HashRouter>
        <Routes>
            <Route path="/" element={<Whiteboard />} />
            <Route path="/b/:sid" element={<Whiteboard />} />
        </Routes>
    </HashRouter>
) : (
    <Routes>
        <Route path="/" element={<Whiteboard />} />
        <Route path="/b/:sid" element={<Whiteboard />} />
    </Routes>
)
