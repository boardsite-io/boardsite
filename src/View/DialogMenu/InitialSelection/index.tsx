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
    menu.setSessionDialog(DialogState.Closed)
}

const createOnlineSession = () => {
    menu.setSessionDialog(DialogState.CreateOnlineSession)
}

const continuePreviousSession = async () => {
    await board.loadFromLocalStorage()
    menu.setSessionDialog(DialogState.Closed)
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
                <FormattedMessage id="DialogMenu.InitialSelection.Title" />
            </DialogTitle>
            <DialogContent>
                <PageSettings />
                {firstLoad && (
                    <Button
                        disabled={!showContinue}
                        onClick={continuePreviousSession}
                    >
                        <FormattedMessage id="DialogMenu.InitialSelection.Continue" />
                    </Button>
                )}
                <Button onClick={createOfflineSession}>
                    <FormattedMessage id="DialogMenu.InitialSelection.CreateOffline" />
                </Button>
                <Button onClick={createOnlineSession}>
                    <FormattedMessage id="DialogMenu.InitialSelection.OnlineSessionMenu" />
                </Button>
            </DialogContent>
        </>
    )
}

export default InitialSelection
