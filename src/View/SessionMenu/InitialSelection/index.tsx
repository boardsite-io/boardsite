import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import { Button, DialogContent, DialogTitle } from "components"
import PageSettings from "components/PageSettings"
import { handleAddPageUnder } from "drawing/handlers"
import { LOAD_BOARD_STATE } from "redux/board"
import { loadIndexedDB } from "redux/localstorage"
import { BoardState } from "redux/board/index.types"
import { online } from "state/online"
import { DialogState } from "state/online/state/index.types"

const createOfflineSession = () => {
    handleAddPageUnder()
    online.setSessionDialog(DialogState.Closed)
}

const createOnlineSession = () => {
    online.setSessionDialog(DialogState.CreateOnlineSession)
}

const continuePreviousSession = async () => {
    const state = await loadIndexedDB("board")

    store.dispatch(LOAD_BOARD_STATE(state.board as BoardState))
    online.setSessionDialog(DialogState.Closed)
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
