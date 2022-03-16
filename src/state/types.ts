export interface GlobalState<T> {
    state: T
    getState: () => T
    setState: (newState: T) => void
}

export type SerializedState<T> = Partial<T> & { version?: string }
