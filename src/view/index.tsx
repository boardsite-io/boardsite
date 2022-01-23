import React from "react"
import BoardStage from "board/stage"
import { useKeyboardShortcuts } from "hooks"
import { StyledView } from "./index.styled"
import SessionInfo from "./sessioninfo"
import ToolRing from "./toolRing"
import FavoriteTools from "./favoriteTools"
import Loading from "./loading"
import About from "./about"
import SettingsMenu from "./settingsMenu"
import SessionMenu from "./sessionMenu"
import ImportMenu from "./importMenu"
import ExportMenu from "./exportMenu"
import GeneralMenu from "./generalMenu"

const View: React.FC = () => {
    useKeyboardShortcuts()

    return (
        <StyledView>
            <BoardStage />
            <SessionInfo />
            <ToolRing />
            <FavoriteTools />
            <About />
            <GeneralMenu />
            <SettingsMenu />
            <SessionMenu />
            <ImportMenu />
            <ExportMenu />
            <Loading />
        </StyledView>
    )
}

export default View
