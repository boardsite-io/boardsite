import React from "react"
import { useInitialDialog, useKeyboardShortcuts, useWindowResize } from "hooks"
import Board from "./Board"
import { ViewWrap } from "./index.styled"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import DialogMenu from "./DialogMenu"
import MainMenu from "./MainMenu"
import Notification from "./Notification"
import Shortcuts from "./Shortcuts"
import Subscribe from "./Subscribe"

const View: React.FC = () => {
    useKeyboardShortcuts()
    useInitialDialog()
    useWindowResize()

    return (
        <ViewWrap>
            <Board />
            <DialogMenu />
            <Subscribe />
            <Shortcuts />
            <Loading />
            <Notification />
            <MainMenu />
            <ToolRing />
            <FavoriteTools />
        </ViewWrap>
    )
}

export default View
