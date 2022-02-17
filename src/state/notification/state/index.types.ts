import { IntlMessageId } from "language"
import { Subscribers } from "state/index.types"

export interface NotificationState {
    notifications: IntlMessageId[]
}

export type NotificationSubscribers = {
    notification: Subscribers
}

export type NotificationSubscription = keyof NotificationSubscribers
