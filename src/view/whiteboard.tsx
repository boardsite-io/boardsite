import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { handleAddPageOver } from "../drawing/handlers"
import boardKeyListener from "../component/board/keylistener"
import Toolbar from "../component/menu/toolbar"
import BoardStage from "../component/board/stage"
import SessionInfo from "../component/menu/menucomponents/sessioninfo"
import ViewNav from "../component/menu/viewnavigation"
import { SET_SDIAG } from "../redux/slice/webcontrol"
import { isConnected, pingSession } from "../api/websocket"
import FavTools from "../component/menu/favtools"

export default function Whiteboard() {
    const { sid } = useParams<{ sid: string }>()
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
            } else {
                // url is "/", add default page
                handleAddPageOver()
            }
        }
    }, [sid, dispatch])

    useEffect(() => {
        document.addEventListener("keydown", boardKeyListener)
    }, [])

    return (
        <div className="whiteboard">
            <BoardStage />
            <SessionInfo />
            <Toolbar />
            <FavTools />
            <ViewNav />
        </div>
    )
}
