import React from "react"
import { Button, DialogContent, DialogTitle, PageSettings } from "components"
import { handleAddPageUnder } from "drawing/handlers"
import store from "redux/store"
import { DialogState } from "redux/session/session.types"
import { SET_SESSION_DIALOG } from "redux/session/session"
import { LOAD_BOARD_STATE } from "redux/board/board"
import { loadIndexedDB } from "redux/localstorage"

const createOfflineSession = () => {
    handleAddPageUnder()
    store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
}

const createOnlineSession = () => {
    store.dispatch(SET_SESSION_DIALOG(DialogState.CreateOnlineSession))
}

const continuePreviousSession = async () => {
    const state = await loadIndexedDB("board")

    store.dispatch(LOAD_BOARD_STATE(state.board))
    store.dispatch(SET_SESSION_DIALOG(DialogState.Closed))
}

interface InitialSelectionProps {
    firstLoad: boolean
}

const InitialSelection: React.FC<InitialSelectionProps> = ({ firstLoad }) => {
    return (
        <>
            <DialogTitle>Local Session</DialogTitle>
            <DialogContent>
                <PageSettings />
                <Button onClick={createOfflineSession}>
                    Create offline session
                </Button>
                <Button onClick={createOnlineSession}>
                    Create online session
                </Button>
                {firstLoad && (
                    <Button onClick={continuePreviousSession}>
                        Continue previous session
                    </Button>
                )}
            </DialogContent>
        </>
    )
}

export default InitialSelection
