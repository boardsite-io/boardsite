import React, { useCallback, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BoardStage from "board/stage"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { useCustomDispatch, useKeyboardShortcuts } from "hooks"
import { isConnected, currentSession } from "api/session"
import { WhiteboardStyled } from "./whiteboard.styled"
import SessionInfo from "./sessioninfo/sessioninfo"
import Toolbar from "./toolbar/toolbar"
import FavTools from "./favtools/favtools"
import Loading from "./loading"
import ViewNav from "./viewnavigation/viewnavigation"
import Settings from "./settings/settings"
import About from "./about/about"
import PageOptions from "./pageoptions/pageoptions"
import PdfUpload from "./pdfupload/pdfupload"
import Session from "./session"

const Whiteboard: React.FC = () => {
    useKeyboardShortcuts()
    const { sid } = useParams()
    const dispatch = useCustomDispatch()
    const navigate = useNavigate()

    const checkSessionStatus = useCallback(async () => {
        try {
            if (sid === undefined) {
                throw new Error()
            }

            await currentSession().setID(sid).ping()

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
            navigate("/") // Redirect to home route
        }
    }, [])

    useEffect(() => {
        if (!isConnected() && sid !== undefined && sid.length > 0) {
            checkSessionStatus()
        }
    }, [sid, dispatch])

    return (
        <WhiteboardStyled>
            <BoardStage />
            <SessionInfo />
            <Toolbar />
            <FavTools />
            <ViewNav />
            <Loading />
            <Settings />
            <About />
            <PageOptions />
            <PdfUpload />
            <Session />
        </WhiteboardStyled>
    )
}

export default Whiteboard
