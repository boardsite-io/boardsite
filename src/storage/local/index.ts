import localforage from "localforage"
import { debounce } from "lodash"
import { notification } from "state/notification"

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
        try {
            localStorage.setItem(
                `${NAMESPACE}_${name}`,
                JSON.stringify(serializer())
            )
        } catch (error) {
            notification.create("Notification.LocalStorageSaveFailed")
        }
    },
    DEBOUNCE_LOCAL_STORAGE
)

export const saveIndexedDB = debounce(
    async (name: StateInIndexedDB, serializer: () => object): Promise<void> => {
        try {
            const s = serializer()
            await localforage.setItem(`${NAMESPACE}_${name}`, s)
        } catch (error) {
            notification.create("Notification.IndexedDBSaveFailed")
        }
    },
    DEBOUNCE_INDEXED_DB
)

export const loadLocalStorage = async <T>(
    name: StateInLocalStorage
): Promise<T> => {
    try {
        const data = localStorage.getItem(`${NAMESPACE}_${name}`)
        if (!data) throw new Error(`cannot retrieve ${name} from localStorage`)
        return JSON.parse(data) as T
    } catch (error) {
        notification.create("Notification.LocalStorageLoadFailed")
        throw error
    }
}

export const loadIndexedDB = async <T>(name: StateInIndexedDB): Promise<T> => {
    try {
        const data = await localforage.getItem(`${NAMESPACE}_${name}`)
        if (!data) throw new Error(`cannot retrieve ${name} from indexedDB`)
        return data as T
    } catch (error) {
        notification.create("Notification.IndexedDBLoadFailed")
        throw error
    }
}
