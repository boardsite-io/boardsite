import { IntlMessageId } from "language"
import { GlobalState, RenderTrigger, Subscribers } from "../../index.types"
import { NotificationState } from "./index.types"

export class Notification implements GlobalState<NotificationState> {
    state: NotificationState = { notifications: [] }

    subscribers: Subscribers = []

    addNotification(id: IntlMessageId): void {
        this.state.notifications.unshift(id)
        this.render()
    }

    removeNotification(): void {
        this.state.notifications.pop()
        this.render()
    }

    getState(): NotificationState {
        return this.state
    }

    setState(newState: NotificationState): void {
        this.state = newState
    }

    subscribe(trigger: RenderTrigger) {
        if (this.subscribers.indexOf(trigger) > -1) return
        this.subscribers.push(trigger)
    }

    unsubscribe(trigger: RenderTrigger) {
        this.subscribers = this.subscribers.filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(): void {
        this.subscribers?.forEach((trigger) => {
            trigger({})
        })
    }
}

export const notification = new Notification()
