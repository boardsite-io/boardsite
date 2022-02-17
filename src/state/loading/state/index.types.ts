import { Subscribers } from "state/index.types"

import { IntlMessageId } from "language"

export type LoadingInfo = {
    messageId: IntlMessageId
}

export interface LoadingState {
    isLoading: boolean
    loadingInfo: LoadingInfo
}

export type LoadingSubscribers = {
    loading: Subscribers
}

export type LoadingSubscription = keyof LoadingSubscribers
