// Global States
import { action } from "state/action"
import { board } from "state/board"
import { drawing } from "state/drawing"
import { loading } from "state/loading"
import { menu } from "state/menu"
import { notification } from "state/notification"
import { online } from "state/online"
import { settings } from "state/settings"
import { view } from "state/view"

import { subscriptionState } from "state/subscription"
import { useCallback, useEffect, useState } from "react"
import { Subscription } from "./index.types"

const getGlobalState = () => ({
    action: action.getState(),
    board: board.getState(),
    drawing: drawing.getState(),
    loading: loading.getState(),
    menu: menu.getState(),
    notification: notification.getState(),
    online: online.getState(),
    settings: settings.getState(),
    view: view.getState(),
})

export const useGState = (subscription: Subscription) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        subscriptionState.subscribe(subscription, trigger)

        return () => {
            subscriptionState.unsubscribe(subscription, trigger)
        }
    }, [subscription, trigger])

    return getGlobalState()
}
