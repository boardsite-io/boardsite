import { FormattedMessage } from "language"
import React, { useCallback, useEffect, useState } from "react"
import { Button, DialogContent, DialogTitle } from "components"
import PageSettings from "components/PageSettings"
import { handleAddPageUnder, handleDeleteAllPages } from "drawing/handlers"
import { board } from "state/board"
import { loadIndexedDB } from "storage/local"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { useNavigate } from "react-router-dom"
import { ROUTE } from "App/routes"
import { startBackgroundJob } from "storage/util"

interface InitialSelectionProps {
    firstLoad: boolean
}

const InitialSelection: React.FC<InitialSelectionProps> = ({ firstLoad }) => {
    const navigate = useNavigate()
    const [showContinue, setShowContinue] = useState(false)

    const checkStorage = useCallback(async () => {
        try {
            const data = loadIndexedDB("board")
            setShowContinue(!!data)
        } catch {
            setShowContinue(false)
        }
    }, [])

    useEffect(() => {
        if (firstLoad) {
            checkStorage()
        } else {
            // Leaving or getting kicked from a session opens this
            // dialog so we can navigate to the home route here
            navigate(ROUTE.HOME)
        }
    }, [navigate, firstLoad, checkStorage])

    const createOfflineSession = useCallback(() => {
        handleDeleteAllPages() // Make sure state is clean
        handleAddPageUnder()
        menu.setDialogState(DialogState.Closed)
    }, [])

    const createOnlineSession = useCallback(() => {
        menu.setDialogState(DialogState.OnlineCreate)
    }, [])

    const continuePreviousSession = useCallback(async () => {
        menu.setDialogState(DialogState.Closed)
        await startBackgroundJob(
            "Loading.ContinuePreviousSession",
            board.loadFromLocalStorage.bind(board)
        )
    }, [])

    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.InitialSelection.Title" />
            </DialogTitle>
            <DialogContent>
                <PageSettings />
                {firstLoad && (
                    <Button
                        disabled={!showContinue}
                        onClick={continuePreviousSession}
                    >
                        <FormattedMessage id="Dialog.InitialSelection.Button.Continue" />
                    </Button>
                )}
                <Button onClick={createOfflineSession}>
                    <FormattedMessage id="Dialog.InitialSelection.Button.CreateOffline" />
                </Button>
                <Button onClick={createOnlineSession}>
                    <FormattedMessage id="Dialog.InitialSelection.Button.OnlineCreate" />
                </Button>
            </DialogContent>
        </>
    )
}

export default InitialSelection
