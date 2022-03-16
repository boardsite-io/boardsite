import { DEFAULT_NOTIFICATION_DURATION } from "consts"
import { IntlMessageId } from "language"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "../../types"
import { NotificationState } from "./index.types"

export class Notification implements GlobalState<NotificationState> {
    state: NotificationState = { notifications: [] }

    create(id: IntlMessageId, duration = DEFAULT_NOTIFICATION_DURATION): void {
        this.addNotification(id)

        setTimeout(() => {
            this.removeNotification()
        }, duration)
    }

    private addNotification(id: IntlMessageId): void {
        this.state.notifications.unshift(id)
        subscriptionState.render("Notification")
    }

    private removeNotification(): void {
        this.state.notifications.pop()
        subscriptionState.render("Notification")
    }

    getState(): NotificationState {
        return this.state
    }

    setState(newState: NotificationState): void {
        this.state = newState
    }
}

export const notification = new Notification()
