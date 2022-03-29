import { NavigateFunction } from "react-router-dom"
import { notification } from "../../state/notification"
import { menu } from "../../state/menu"
import { DialogState } from "../../state/menu/state/index.types"
import { ROUTE } from "../../App/routes"
import { Online, online } from "../../state/online"

interface CreateOrJoinConfig {
    navigate: NavigateFunction
    fromCurrent?: boolean
    password?: string
    sessionId?: string
}

/**
 *
 * @param fromCurrent transfers the local session into the online session if set to true
 * @param navigate react-router-dom navigation function
 * @param password Optional session password
 */
export const createOnlineSession = async ({
    fromCurrent,
    navigate,
}: CreateOrJoinConfig): Promise<void> => {
    try {
        const sessionId = await online.create()
        await online.createSocket(sessionId)
        await online.join(fromCurrent)

        // TODO: Password logic
        // if (password.length) {
        //     await online.updateConfig({ password })
        // }

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
        notification.create("Notification.Session.CreationFailed", 2500)
    }
}

export const joinOnlineSession = async ({
    sessionId,
    navigate,
}: CreateOrJoinConfig): Promise<void> => {
    // TODO: Session enter PW prompt when joining pw protected session
    try {
        if (!sessionId) throw new Error("no sessionId provided")
        const path = Online.path(sessionId)
        await online.createSocket(sessionId)
        await online.join()
        menu.setDialogState(DialogState.Closed)
        navigate(path)
    } catch (error) {
        notification.create("Notification.Session.JoinFailed", 5000)
        navigate(ROUTE.HOME)
    }
}
