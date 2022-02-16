// Global types

export interface GlobalState<T> {
    state: T
    subscribers: Subscribers | Record<string, Subscribers>

    getState: () => T
    setState: (newState: T) => void
    subscribe: (trigger: RenderTrigger, subscription?: any) => void
    unsubscribe: (trigger: RenderTrigger, subscription?: any) => void
}

export type RenderTrigger = React.Dispatch<React.SetStateAction<object>>

export type Subscribers = RenderTrigger[]
