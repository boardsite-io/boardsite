import { FormattedMessage } from "language"
import React, { useCallback, useEffect, useState } from "react"
import { Button, DialogContent, DialogTitle } from "components"
import PageSettings from "components/PageSettings"
import { handleAddPageUnder, handleDeleteAllPages } from "drawing/handlers"
import { board } from "state/board"
import { loadIndexedDB } from "storage/local"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"

const createOfflineSession = () => {
    handleDeleteAllPages() // Make sure state is clean
    handleAddPageUnder()
    menu.setDialogState(DialogState.Closed)
}

const createOnlineSession = () => {
    menu.setDialogState(DialogState.OnlineCreate)
}

const continuePreviousSession = async () => {
    await board.loadFromLocalStorage()
    menu.setDialogState(DialogState.Closed)
}

interface InitialSelectionProps {
    firstLoad: boolean
}

const InitialSelection: React.FC<InitialSelectionProps> = ({ firstLoad }) => {
    const [showContinue, setShowContinue] = useState(false)

    const checkStorage = useCallback(async () => {
        const data = await loadIndexedDB("board")
        if (data !== null) {
            setShowContinue(true)
        }
    }, [])

    useEffect(() => {
        if (firstLoad) {
            checkStorage()
        }
    }, [firstLoad, checkStorage])

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
