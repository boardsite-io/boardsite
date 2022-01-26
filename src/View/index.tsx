import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
import { ViewWrap } from "./index.styled"
import SessionInfo from "./SessionInfo"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import About from "./About"
import SessionMenu from "./SessionMenu"
import ImportMenu from "./ImportMenu"
import ExportMenu from "./ExportMenu"
import MainMenu from "./MainMenu"

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
