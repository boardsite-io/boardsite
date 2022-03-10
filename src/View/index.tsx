import React, { useEffect } from "react"
import { useKeyboardShortcuts } from "hooks"
import { drawing } from "state/drawing"
import Board from "./Board"
import { ViewWrap } from "./index.styled"
import ToolRing from "./ToolRing"
import FavoriteTools from "./FavoriteTools"
import Loading from "./Loading"
import DialogMenu from "./DialogMenu"
import MainMenu from "./MainMenu"
import Notification from "./Notification"
import Shortcuts from "./Shortcuts"
import { online } from "../state/online"
import Subscribe from "./Subscribe"

const View: React.FC = () => {
    useKeyboardShortcuts()

    useEffect(() => {
        drawing.loadFromLocalStorage()
        online.loadFromLocalStorage()
    }, [])

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
