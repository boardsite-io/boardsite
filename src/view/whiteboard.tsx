import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import SessionInfo from "menu/toolbar/sessioninfo/sessioninfo"
import Loading from "menu/loading/loading"
import { handleAddPageOver, handleDeleteAllPages } from "../drawing/handlers"
import boardKeyListener from "../board/keylistener"
import Toolbar from "../menu/toolbar/toolbar"
import BoardStage from "../board/stage"
import ViewNav from "../menu/viewnavigation/viewnavigation"
import { SET_SDIAG } from "../redux/session/session"
import { isConnected, pingSession } from "../api/websocket"
import FavTools from "../menu/favtools/favtools"
import { useCustomDispatch } from "../redux/hooks"
import { WhiteboardStyled } from "./whiteboard.styled"

const Whiteboard: React.FC = () => {
    const { sid } = useParams<{ sid: string }>()
    const dispatch = useCustomDispatch()

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
                handleDeleteAllPages()
                handleAddPageOver()
            }
        }
    }, [sid, dispatch])

    useEffect(() => {
        document.addEventListener("keydown", boardKeyListener)
    }, [])

    return (
        <WhiteboardStyled>
            <BoardStage />
            <SessionInfo />
            <Toolbar />
            <FavTools />
            <ViewNav />
            <Loading />
        </WhiteboardStyled>
    )
}

export default Whiteboard
