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
            await localforage.setItem(`${NAMESPACE}_${name}`, serializer())
        } catch (error) {
            notification.create("Notification.IndexedDBSaveFailed")
        }
    },
    DEBOUNCE_INDEXED_DB
)

export const loadLocalStorage = async (
    name: StateInLocalStorage
): Promise<object | null> => {
    try {
        const data = localStorage.getItem(`${NAMESPACE}_${name}`)
        if (data === null) return null

        return JSON.parse(data)
    } catch (error) {
        notification.create("Notification.LocalStorageLoadFailed")
        return null
    }
}

export const loadIndexedDB = async (
    name: StateInIndexedDB
): Promise<object | null> => {
    try {
        const data = await localforage.getItem(`${NAMESPACE}_${name}`)
        if (!data) return null

        return data as object
    } catch (error) {
        notification.create("Notification.IndexedDBLoadFailed")
        return null
    }
}
