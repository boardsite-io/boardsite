import React, { useEffect } from "react"
import FPSStats from "react-fps-stats"
import { handleAddPage } from "../component/board/requestHandlers"
import boardKeyListener from "../component/board/keylistener"
import Toolbar from "../component/menu/toolbar"
import Viewbar from "../component/menu/viewbar"
import BoardStage from "../component/board/stage"

export default function Whiteboard() {
    // Open dialog on mount
    useEffect(() => {
        // setOpenSessionDialog(true);
        handleAddPage()
        document.addEventListener("keydown", boardKeyListener)
    }, [])

    return (
        <div className="whiteboard">
            <BoardStage />
            <FPSStats />
            <Viewbar />
            <Toolbar />
        </div>
    )
}
