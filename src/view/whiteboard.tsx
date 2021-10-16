import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import SessionInfo from "menu/toolbar/sessioninfo/sessioninfo"
import Loading from "menu/loading/loading"
import store from "redux/store"
import {
    handleAddPageOver,
    handleDeleteAllPages,
} from "../redux/drawing/util/handlers"
import boardKeyListener from "../render/keylistener"
import Toolbar from "../menu/toolbar/toolbar"
import BoardStage from "../render/stage"
import ViewNav from "../menu/viewnavigation/viewnavigation"
import { isConnected, pingSession } from "../api/websocket"
import FavTools from "../menu/favtools/favtools"
import { WhiteboardStyled } from "./whiteboard.styled"

const Whiteboard: React.FC = () => {
    const { sid } = useParams<{ sid: string }>()

    useEffect(() => {
        if (!isConnected()) {
            if (sid !== undefined && sid.length > 0) {
                // ping the session
                pingSession(sid)
                    .then(() => {
                        // session ok
                        store.dispatch({
                            type: "SET_SDIAG",
                            payload: {
                                open: true,
                                invalidSid: false,
                                joinOnly: true,
                                sidInput: sid,
                            },
                        })
                    })
                    .catch(() => {
                        // session not existing
                        store.dispatch({
                            type: "SET_SDIAG",
                            payload: {
                                open: true,
                                invalidSid: true,
                                joinOnly: false,
                            },
                        })
                    })
            } else {
                // url is "/", add default page
                handleDeleteAllPages()
                handleAddPageOver()
            }
        }
    }, [sid])

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
