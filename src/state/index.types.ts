// Global types

/**
 * T: State
 * U: Subscribers
 */
export interface GlobalState<T, U> {
    state: T
    subscribers: U

    getState: () => T
    setState: (newState: T) => void
    subscribe: (trigger: RenderTrigger, subscription: keyof U) => void
    unsubscribe: (trigger: RenderTrigger, subscription: keyof U) => void
}

export type RenderTrigger = React.Dispatch<React.SetStateAction<object>>

export type Subscribers = RenderTrigger[]
