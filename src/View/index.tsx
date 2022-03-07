import React, { useEffect } from "react"
import { useKeyboardShortcuts } from "hooks"
import { drawing } from "state/drawing"
import Board from "./Board"
import { ViewWrap } from "./index.styled"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import SessionMenu from "./SessionMenu"
import MainMenu from "./MainMenu"
import Notification from "./Notification"
import Shortcuts from "./Shortcuts"
import { online } from "../state/online"

const View: React.FC = () => {
    useKeyboardShortcuts()

    useEffect(() => {
        // TODO error handling
        drawing.loadFromLocalStorage()
        online.loadFromLocalStorage()
    }, [])

    return (
        <ViewWrap>
            <Board />
            <MainMenu />
            <ToolRing />
            <FavoriteTools />
            <SessionMenu />
            <Shortcuts />
            <Loading />
            <Notification />
        </ViewWrap>
    )
}

export default View
