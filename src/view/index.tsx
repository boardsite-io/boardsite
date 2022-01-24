import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
import { ViewWrap } from "./index.styled"
import SessionInfo from "./sessioninfo"
import ToolRing from "./toolRing"
import FavoriteTools from "./favoriteTools"
import Loading from "./loading"
import About from "./about"
import SessionMenu from "./sessionMenu"
import ImportMenu from "./importMenu"
import ExportMenu from "./exportMenu"
import MainMenu from "./mainMenu"

const View: React.FC = () => {
    useKeyboardShortcuts()

    return (
        <ViewWrap>
            <BoardStage />
            <SessionInfo />
            <ToolRing />
            <FavoriteTools />
            <About />
            <MainMenu />
            <SessionMenu />
            <ImportMenu />
            <ExportMenu />
            <Loading />
        </ViewWrap>
    )
}

export default View
