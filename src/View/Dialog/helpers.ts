import { NavigateFunction } from "react-router-dom"
import { notification } from "state/notification"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"
import { Online, online } from "state/online"
import { ErrorCode } from "api/types"
import { ROUTE } from "App/routes"
import { isErrorResponse } from "api/error"

interface CreateOnlineSession {
    navigate: NavigateFunction // react-router-dom navigation function
    fromCurrent: boolean // transfers the local session into the online session if set to true
    password: string // Optional session password
}

export const createOnlineSession = async ({
    fromCurrent,
    navigate,
    password,
}: CreateOnlineSession): Promise<void> => {
    try {
        const sessionId = await online.createSession({ password })
        await online.createSocket(sessionId, password)
        await online.join(fromCurrent)

        navigate(Online.path(sessionId))

        // Copy session URL to the clipboard to make it easier to invite friends
        try {
            await navigator.clipboard.writeText(window.location.href)
            notification.create("Notification.Session.CopiedToClipboard")
        } catch (error) {
            // Could not save URL to clipboard - no notification needed here
        }

        menu.setDialogState(DialogState.Closed)
    } catch (error) {
        online.disconnect()
        notification.create("Notification.Session.CreationFailed", 2500)
    }
}

interface JoinOnlineSession {
    navigate: NavigateFunction
    sessionId: string
    password?: string
    onWrongPassword?: () => void
}

export const joinOnlineSession = async ({
    sessionId,
    password,
    onWrongPassword,
    navigate,
}: JoinOnlineSession): Promise<void> => {
    try {
        if (!sessionId) throw new Error("no sessionId provided")

        const path = Online.path(sessionId)
        await online.createSocket(sessionId, password)
        await online.join()

        navigate(path)

        menu.setDialogState(DialogState.Closed)
    } catch (error) {
        if (isErrorResponse(error, ErrorCode.InvalidPassword)) {
            onWrongPassword?.()
        } else {
            online.disconnect()
            navigate(ROUTE.HOME)
            notification.create("Notification.Session.JoinFailed", 5000)
        }
    }
}
