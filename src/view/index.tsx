import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
import { StyledView } from "./index.styled"
import SessionInfo from "./sessioninfo"
import Toolbar from "./toolbar"
import FavoriteTools from "./favoriteTools"
import Loading from "./loading"
import ViewNavigation from "./viewnavigation"
import About from "./about"
import SettingsMenu from "./settingsMenu"
import SessionMenu from "./sessionMenu"
import ImportMenu from "./importMenu"
import ExportMenu from "./exportMenu"
import GeneralMenu from "./generalMenu"
import PageOptions from "./pageOptions"

const View: React.FC = () => {
    useKeyboardShortcuts()

    return (
        <StyledView>
            <BoardStage />
            <SessionInfo />
            <Toolbar />
            <FavoriteTools />
            <ViewNavigation />
            <About />
            <GeneralMenu />
            <SettingsMenu />
            <SessionMenu />
            <PageOptions />
            <ImportMenu />
            <ExportMenu />
            <Loading />
        </StyledView>
    )
}

export default View
