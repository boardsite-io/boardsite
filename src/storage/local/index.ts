import localforage from "localforage"
import { debounce } from "lodash"

const NAMESPACE = "boardsite"
const DEBOUNCE_LOCAL_STORAGE = 500
const DEBOUNCE_INDEXED_DB = 500

localforage.config({
    name: NAMESPACE,
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
})

type StateInLocalStorage = "drawing" | "online" | "settings"

type StateInIndexedDB = "board"

export const saveLocalStorage = debounce(
    (name: StateInLocalStorage, serializer: () => object): void => {
        localStorage.setItem(
            `${NAMESPACE}_${name}`,
            JSON.stringify(serializer())
        )
    },
    DEBOUNCE_LOCAL_STORAGE
)

export const saveIndexedDB = debounce(
    async (name: StateInIndexedDB, serializer: () => object): Promise<void> => {
        await localforage.setItem(`${NAMESPACE}_${name}`, serializer())
    },
    DEBOUNCE_INDEXED_DB
)

export const loadLocalStorage = async <T>(
    name: StateInLocalStorage
): Promise<T | undefined> => {
    const data = localStorage.getItem(`${NAMESPACE}_${name}`)
    if (!data) return undefined
    return JSON.parse(data) as T
}

export const loadIndexedDB = async <T>(
    name: StateInIndexedDB
): Promise<T | undefined> => {
    const data = await localforage.getItem(`${NAMESPACE}_${name}`)
    if (!data) return undefined
    return data as T
}
