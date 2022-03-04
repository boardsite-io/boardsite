import { NOTIFICATION_DURATION } from "consts"
import { IntlMessageId } from "language"
import { GlobalState, RenderTrigger } from "../../index.types"
import {
    NotificationState,
    NotificationSubscribers,
    NotificationSubscription,
} from "./index.types"

export class Notification
    implements GlobalState<NotificationState, NotificationSubscribers>
{
    state: NotificationState = { notifications: [] }

    subscribers: NotificationSubscribers = { notification: [] }

    create(id: IntlMessageId): void {
        this.addNotification(id)

        setTimeout(() => {
            this.removeNotification()
        }, NOTIFICATION_DURATION)
    }

    private addNotification(id: IntlMessageId): void {
        this.state.notifications.unshift(id)
        this.render("notification")
    }

    private removeNotification(): void {
        this.state.notifications.pop()
        this.render("notification")
    }

    getState(): NotificationState {
        return this.state
    }

    setState(newState: NotificationState): void {
        this.state = newState
    }

    subscribe(subscription: NotificationSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(
        subscription: NotificationSubscription,
        trigger: RenderTrigger
    ) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: NotificationSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const notification = new Notification()
