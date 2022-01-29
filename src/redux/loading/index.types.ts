import { IntlMessageId } from "language"

export type LoadingInfo = {
    messageId: IntlMessageId
}

export interface LoadingState {
    isLoading: boolean
    loadingInfo: LoadingInfo
}
