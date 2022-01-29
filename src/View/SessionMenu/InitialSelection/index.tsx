import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import { Button, DialogContent, DialogTitle } from "components"
import PageSettings from "components/PageSettings"
import { handleAddPageUnder } from "drawing/handlers"
import { DialogState } from "redux/session/index.types"
import { SET_SESSION_DIALOG } from "redux/session"
import { LOAD_BOARD_STATE } from "redux/board"
import { loadIndexedDB } from "redux/localstorage"
import { BoardState } from "redux/board/index.types"

const createOfflineSession = () => {
    handleAddPageUnder()
    store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
}

const createOnlineSession = () => {
    store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
}

const continuePreviousSession = async () => {
    const state = await loadIndexedDB("board")

    store.dispatch(LOAD_BOARD_STATE(state.board as BoardState))
    store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
}

interface InitialSelectionProps {
    firstLoad: boolean
}

const InitialSelection: React.FC<InitialSelectionProps> = ({ firstLoad }) => {
    return (
        <>
            <DialogTitle>
                <FormattedMessage id="SessionMenu.InitialSelection.Title" />
            </DialogTitle>
            <DialogContent>
                <PageSettings />
                {firstLoad && (
                    <Button onClick={continuePreviousSession}>
                        <FormattedMessage id="SessionMenu.InitialSelection.Continue" />
                    </Button>
                )}
                <Button onClick={createOfflineSession}>
                    <FormattedMessage id="SessionMenu.InitialSelection.CreateOffline" />
                </Button>
                <Button onClick={createOnlineSession}>
                    <FormattedMessage id="SessionMenu.InitialSelection.OnlineSessionMenu" />
                </Button>
            </DialogContent>
        </>
    )
}

export default InitialSelection
