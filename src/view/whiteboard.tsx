import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import store from "redux/store"
import { handleAddPageUnder } from "drawing/handlers"
import boardKeyListener from "board/keylistener"
import BoardStage from "board/stage"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { useCustomDispatch } from "redux/hooks"
import { isConnected, pingSession } from "api/websocket"
import { WhiteboardStyled } from "./whiteboard.styled"
import SessionInfo from "./sessioninfo/sessioninfo"
import Toolbar from "./toolbar/toolbar"
import FavTools from "./favtools/favtools"
import Loading from "./loading/loading"
import ViewNav from "./viewnavigation/viewnavigation"

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
                            SET_SESSION_DIALOG({
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
                            SET_SESSION_DIALOG({
                                open: true,
                                invalidSid: true,
                                joinOnly: false,
                            })
                        )
                    })
            } else if (store.getState().board.pageRank.length === 0) {
                // if there is noting in the (local) store, add a default page
                handleAddPageUnder()
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
