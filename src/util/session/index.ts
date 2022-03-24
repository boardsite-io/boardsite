import { BoardSession } from "api/session"
import { ROUTE } from "App/routes"
import { NavigateFunction } from "react-router-dom"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { notification } from "state/notification"
import { online } from "state/online"

type CreateOnlineSession = {
    fromCurrent: boolean // transfers the local session into the online session if set to true
    password: string // Optional session password
    navigate: NavigateFunction // react-router-dom navigation function
}

export const createOnlineSession = async ({
    fromCurrent,
    navigate,
    password,
}: CreateOnlineSession): Promise<void> => {
    try {
        const session = new BoardSession(online.getState().user)
        const sessionId = await session.create()
        await session.createSocket(sessionId)
        await session.join(fromCurrent)

        // TODO: Clean up pw logic (and online state in general)
        if (password.length) {
            await session.updateConfig({ password })
        }

        online.newSession(session)

        navigate(BoardSession.path(sessionId))

        // Copy session URL to the clipboard to make it easier to invite friends
        try {
            navigator.clipboard.writeText(window.location.href)
            notification.create("Notification.Session.CopiedToClipboard")
        } catch (error) {
            // Could not save URL to clipboard - no notification needed here
        }

        menu.setDialogState(DialogState.Closed)
    } catch (error) {
        notification.create("Notification.Session.CreationFailed", 2500)
    }
}

type JoinOnlineSession = {
    sessionId: string // target session ID
    navigate: NavigateFunction // react-router-dom navigation function
}

export const joinOnlineSession = async ({
    sessionId,
    navigate,
}: JoinOnlineSession): Promise<void> => {
    // TODO: Session enter PW prompt when joining pw protected session
    try {
        const path = BoardSession.path(sessionId)
        const session = new BoardSession(online.state.user)
        await session.createSocket(sessionId)
        await session.join()
        online.newSession(session)
        menu.setDialogState(DialogState.Closed)
        navigate(path)
    } catch (error) {
        notification.create("Notification.Session.JoinFailed", 5000)
        navigate(ROUTE.HOME)
    }
}
