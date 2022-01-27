import React from "react"
import { useKeyboardShortcuts } from "hooks"
import BoardStage from "./BoardStage"
import { ViewWrap } from "./index.styled"
import SessionInfo from "./SessionInfo"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import About from "./About"
import SessionMenu from "./SessionMenu"
import MainMenu from "./MainMenu"
import Notification from "./Notification"

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
            <Loading />
            <Notification />
        </ViewWrap>
    )
}

export default View
