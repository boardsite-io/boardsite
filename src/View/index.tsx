import React from "react"
import {
    usePreventFileOpen,
    useInitialDialog,
    useKeyboardShortcuts,
    useWindowResize,
} from "hooks"
import Board from "./Board"
import { ViewWrap } from "./index.styled"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import Dialog from "./Dialog"
import MainMenu from "./MainMenu"
import Notification from "./Notification"
import Shortcuts from "./Shortcuts"
import TextfieldSettings from "./TextfieldSettings"

const View: React.FC = () => {
    useKeyboardShortcuts()
    usePreventFileOpen()
    useInitialDialog()
    useWindowResize()

    return (
        <ViewWrap>
            <Board />
            <Dialog />
            <Shortcuts />
            <Loading />
            <Notification />
            <MainMenu />
            <ToolRing />
            <FavoriteTools />
            <TextfieldSettings />
        </ViewWrap>
    )
}

export default View
