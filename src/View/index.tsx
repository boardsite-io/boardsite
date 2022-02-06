import React from "react"
import { useKeyboardShortcuts } from "hooks"
import Board from "./Board"
import { ViewWrap } from "./index.styled"
import SessionInfo from "./SessionInfo"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import SessionMenu from "./SessionMenu"
import MainMenu from "./MainMenu"
import Notification from "./Notification"
import Shortcuts from "./Shortcuts"

const View: React.FC = () => {
    useKeyboardShortcuts()

    return (
        <ViewWrap>
            <Board />
            <SessionInfo />
            <ToolRing />
            <FavoriteTools />
            <MainMenu />
            <SessionMenu />
            <Shortcuts />
            <Loading />
            <Notification />
        </ViewWrap>
    )
}

export default View
