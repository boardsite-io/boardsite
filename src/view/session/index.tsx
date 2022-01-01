import {
    Button,
    Dialog,
    DialogContent,
    DialogOptions,
    PageSettings,
} from "components"
import React from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { loadIndexedDB } from "redux/localstorage"
import { LOAD_BOARD_STATE } from "redux/board/board"
import { handleAddPageUnder } from "drawing/handlers"
import { CLOSE_SESSION_DIALOG } from "redux/session/session"
import { useParams } from "react-router-dom"
import { isConnected } from "api/session"
import OnlineDialogContent from "./onlinedialogcontent"
import OfflineDialogContent from "./offlinedialogcontent"

let firstLoad = true

const Session: React.FC = () => {
    const connectedToSession = isConnected()
    const open = useCustomSelector((state) => state.session.sessionDialog.open)
    const showInitialOptions = useCustomSelector(
        (state) => state.session.sessionDialog.showInitialOptions
    )
    const { sid } = useParams()

    const continuePreviousSession = async () => {
        const state = await loadIndexedDB("board")

        store.dispatch(LOAD_BOARD_STATE(state.board))
        handleClose()
    }

    const createOfflineSession = () => {
        handleAddPageUnder()
        handleClose()
    }

    const handleClose = () => {
        store.dispatch(CLOSE_SESSION_DIALOG())
        firstLoad = false
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                {showInitialOptions && sid === undefined && (
                    <>
                        <h2>Local Session </h2>
                        <PageSettings />
                        <Button onClick={createOfflineSession}>
                            Create offline session
                        </Button>
                        {firstLoad && (
                            <Button onClick={continuePreviousSession}>
                                Continue previous session
                            </Button>
                        )}
                    </>
                )}
                <h2>Collaborative Session 👋🏻</h2>
                {connectedToSession ? (
                    <OnlineDialogContent />
                ) : (
                    <OfflineDialogContent />
                )}
            </DialogContent>
            <DialogOptions>
                <Button onClick={handleClose}>Close</Button>
            </DialogOptions>
        </Dialog>
    )
}

export default Session
