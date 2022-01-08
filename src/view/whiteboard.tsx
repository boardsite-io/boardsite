import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
import { WhiteboardStyled } from "./whiteboard.styled"
import SessionInfo from "./sessioninfo/sessioninfo"
import Toolbar from "./toolbar/toolbar"
import FavoriteTools from "./favoriteTools"
import Loading from "./loading"
import ViewNav from "./viewnavigation/viewnavigation"
import Settings from "./settings/settings"
import About from "./about/about"
import PageMenu from "./pageMenu"
import Session from "./session"
import ImportMenu from "./importMenu"
import ExportMenu from "./exportMenu"

const Whiteboard: React.FC = () => {
    useKeyboardShortcuts()

    return (
        <WhiteboardStyled>
            <BoardStage />
            <SessionInfo />
            <Toolbar />
            <FavoriteTools />
            <ViewNav />
            <Loading />
            <Settings />
            <About />
            <PageMenu />
            <ImportMenu />
            <ExportMenu />
            <Session />
        </WhiteboardStyled>
    )
}

export default Whiteboard
