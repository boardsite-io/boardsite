import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
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
