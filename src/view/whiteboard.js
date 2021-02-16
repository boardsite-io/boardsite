import React, { useEffect } from "react"
import { handleAddPage } from "../component/board/requestHandlers"
import boardKeyListener from "../component/board/keylistener"
import Toolbar from "../component/menu/toolbar"
import BoardStage from "../component/board/stage"
import SessionInfo from "../component/menu/sessioninfo"
import ViewNav from "../component/menu/viewnavigation"
import StylePicker from "../component/menu/stylepicker"

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
            <Toolbar />
            <SessionInfo />
            <ViewNav />
            <StylePicker />
        </div>
    )
}
