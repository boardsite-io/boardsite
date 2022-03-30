import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { menu } from "state/menu"
import { DialogState } from "state/menu/state/index.types"

let isFirstLoad = true

/**
 * Set the suitable initial dialog on first load
 */
export const useInitialDialog = () => {
    const { sessionId } = useParams()

    useEffect(() => {
        if (!isFirstLoad) return
        isFirstLoad = false

        if (sessionId) {
            menu.setDialogState(DialogState.OnlineJoin)
        } else {
            menu.setDialogState(DialogState.InitialSelectionFirstLoad)
        }
    }, [sessionId])
}
