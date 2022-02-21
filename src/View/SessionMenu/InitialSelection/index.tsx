import { FormattedMessage } from "language"
import React from "react"
import { Button, DialogContent, DialogTitle } from "components"
import PageSettings from "components/PageSettings"
import { handleAddPageUnder } from "drawing/handlers"
import { online } from "state/online"
import { DialogState } from "state/online/state/index.types"
import { board } from "state/board"

const createOfflineSession = () => {
    handleAddPageUnder()
    online.setSessionDialog(DialogState.Closed)
}

const createOnlineSession = () => {
    online.setSessionDialog(DialogState.CreateOnlineSession)
}

const continuePreviousSession = async () => {
    await board.loadFromLocalStorage()
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
