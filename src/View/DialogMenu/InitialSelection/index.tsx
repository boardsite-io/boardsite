import { FormattedMessage } from "language"
import React, { useCallback, useEffect, useState } from "react"
import { Button, DialogContent, DialogTitle } from "components"
import { handleNewWorkspace } from "drawing/handlers"
import { board } from "state/board"
import { loadIndexedDB } from "storage/local"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { useNavigate } from "react-router-dom"
import { ROUTE } from "App/routes"
import { startBackgroundJob } from "storage/util"
import PaperSize from "./PaperSize"
import PaperBackground from "./PaperBackground"
import { CreateButtons } from "./index.styled"

interface InitialSelectionProps {
    firstLoad: boolean
}

const InitialSelection: React.FC<InitialSelectionProps> = ({ firstLoad }) => {
    const navigate = useNavigate()
    const [showContinue, setShowContinue] = useState(false)

    const checkStorage = useCallback(async () => {
        try {
            const data = await loadIndexedDB("board")
            setShowContinue(!!data)
        } catch {
            setShowContinue(false)
        }
    }, [])

    useEffect(() => {
        checkStorage()
        if (!firstLoad) {
            // Leaving or getting kicked from a session opens this
            // dialog so we can navigate to the home route here
            navigate(ROUTE.HOME)
        }
    }, [navigate, firstLoad, checkStorage])

    const createOfflineSession = useCallback(() => {
        handleNewWorkspace()
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
                <p>
                    <FormattedMessage id="Dialog.InitialSelection.Description.Presets" />
                </p>
                <PaperSize />
                <PaperBackground />
                <p>
                    <FormattedMessage id="Dialog.InitialSelection.Description.Create" />
                </p>
                <CreateButtons>
                    <Button onClick={createOfflineSession}>
                        <FormattedMessage id="Dialog.InitialSelection.Button.CreateOffline" />
                    </Button>
                    <Button onClick={createOnlineSession}>
                        <FormattedMessage id="Dialog.InitialSelection.Button.OnlineCreate" />
                    </Button>
                </CreateButtons>
                {showContinue && (
                    <Button onClick={continuePreviousSession}>
                        <FormattedMessage id="Dialog.InitialSelection.Button.Continue" />
                    </Button>
                )}
            </DialogContent>
        </>
    )
}

export default InitialSelection
