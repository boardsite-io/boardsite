import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { handleAddPage } from "../component/board/request_handlers"
import boardKeyListener from "../component/board/keylistener"
import Toolbar from "../component/menu/toolbar"
import BoardStage from "../component/board/stage"
import SessionInfo from "../component/menu/sessioninfo"
import ViewNav from "../component/menu/viewnavigation"
import { SET_SDIAG } from "../redux/slice/webcontrol"
import { isConnected, pingSession } from "../api/websocket"

export default function Whiteboard() {
    const { sid } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isConnected()) {
            if (sid !== undefined && sid.length > 0) {
                // ping the session
                pingSession(sid)
                    .then(() => {
                        // session ok
                        dispatch(
                            SET_SDIAG({
                                open: true,
                                invalidSid: false,
                                joinOnly: true,
                                sidInput: sid,
                            })
                        )
                    })
                    .catch(() => {
                        // session not existing
                        dispatch(
                            SET_SDIAG({
                                open: true,
                                invalidSid: true,
                                joinOnly: false,
                            })
                        )
                    })
            }
        }
    }, [sid, dispatch])

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
        </div>
    )
}
