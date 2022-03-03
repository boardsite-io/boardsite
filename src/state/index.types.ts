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
    subscribe: (subscription: keyof U, trigger: RenderTrigger) => void
    unsubscribe: (subscription: keyof U, trigger: RenderTrigger) => void
    render: (subscription: keyof U) => void
}

export type RenderTrigger = React.Dispatch<React.SetStateAction<object>>

export type Subscribers = RenderTrigger[]

export type SerializedState<T> = Partial<T> & { version?: string }
