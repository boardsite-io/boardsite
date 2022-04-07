export interface GlobalState<T> {
    getState: () => T
    setState: (newState: T) => void
}

export type SerializedState<T> = Partial<T> & { version?: string }

export interface Version {
    version?: string
}

export type SerializedVersionState<T> = T & Version

export interface Serializer<T, U> {
    serialize(): U
    deserialize(serialized: U): Promise<T>
}

export interface StateSerializer<T, U extends Version>
    extends Serializer<T, U> {
    saveToLocalStorage(): void
    loadFromLocalStorage(): Promise<T>
}
