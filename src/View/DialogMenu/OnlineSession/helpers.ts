import { BoardSession } from "api/session"
import { ROUTE } from "App/routes"
import { NavigateFunction } from "react-router-dom"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { notification } from "state/notification"
import { online } from "state/online"

/**
 * Create an online session either from current local state or from scratch
 * @param fromCurrent transfers the local session into the online session if set to true
 * @param navigate react-router-dom navigation function
 */
export const createOnlineSession = async (
    fromCurrent: boolean,
    navigate: NavigateFunction
): Promise<void> => {
    try {
        const session = new BoardSession(online.getState().user)
        const sessionId = await session.create()
        await session.createSocket(sessionId)
        await session.join(fromCurrent)
        online.newSession(session)
        navigate(BoardSession.path(sessionId))

        // Copy session URL to the clipboard to make it easier to invite friends
        try {
            navigator.clipboard.writeText(window.location.href)
            notification.create("Notification.Session.CopiedToClipboard")
        } catch (error) {
            // Could not save URL to clipboard - no notification needed here
        }

        menu.setSessionDialog(DialogState.Closed)
    } catch (error) {
        notification.create("Notification.Session.CreationFailed", 2500)
    }
}

/**
 * Join a session with the session ID
 * @param sessionId target session ID
 * @param navigate react-router-dom navigation function
 */
export const joinOnlineSession = async (
    sessionId: string,
    navigate: NavigateFunction
): Promise<void> => {
    try {
        const path = BoardSession.path(sessionId)
        const session = new BoardSession(online.state.user)
        await session.createSocket(sessionId)
        await session.join()
        online.newSession(session)
        menu.setSessionDialog(DialogState.Closed)
        navigate(path)
    } catch (error) {
        notification.create("Notification.Session.JoinFailed", 5000)
        navigate(ROUTE.HOME)
    }
}
