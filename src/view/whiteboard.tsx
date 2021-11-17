import React, { useCallback, useEffect } from "react"
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

    const checkSessionStatus = useCallback(async () => {
        try {
            await pingSession(sid)
            // Session exists
            dispatch(
                SET_SESSION_DIALOG({
                    open: true,
                    invalidSid: false,
                    joinOnly: true,
                    sidInput: sid,
                })
            )
        } catch (error) {
            // Session doesn't exist
            dispatch(
                SET_SESSION_DIALOG({
                    open: true,
                    invalidSid: true,
                    joinOnly: false,
                })
            )
        }
    }, [])

    useEffect(() => {
        if (!isConnected()) {
            if (sid !== undefined && sid.length > 0) {
                checkSessionStatus()
            } else if (store.getState().board.pageRank.length === 0) {
                handleAddPageUnder() // Add default page if pageRank is empty
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
