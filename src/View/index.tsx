import React, { useEffect } from "react"
import { useKeyboardShortcuts } from "hooks"
import { useParams } from "react-router-dom"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
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

    const { sessionId } = useParams()
    useEffect(() => {
        if (sessionId) {
            menu.setDialogState(DialogState.OnlineJoin)
        } else {
            menu.setDialogState(DialogState.InitialSelectionFirstLoad)
        }
    }, [sessionId])

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
