import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
import { StyledView } from "./index.styled"
import SessionInfo from "./sessioninfo/sessioninfo"
import Toolbar from "./toolbar/toolbar"
import FavoriteTools from "./favoriteTools"
import Loading from "./loading"
import ViewNav from "./viewnavigation/viewnavigation"
import About from "./about"
import PageMenu from "./pageMenu"
import SettingsMenu from "./settingsMenu"
import SessionMenu from "./sessionMenu"
import ImportMenu from "./importMenu"
import ExportMenu from "./exportMenu"

const View: React.FC = () => {
    useKeyboardShortcuts()

    return (
        <StyledView>
            <BoardStage />
            <SessionInfo />
            <Toolbar />
            <FavoriteTools />
            <ViewNav />
            <About />
            <PageMenu />
            <SettingsMenu />
            <SessionMenu />
            <ImportMenu />
            <ExportMenu />
            <Loading />
        </StyledView>
    )
}

export default View
