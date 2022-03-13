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

type StateInLocalStorage = "drawing" | "online" | "theme"

type StateInIndexedDB = "board"

export const saveLocalStorage = debounce(
    (name: StateInLocalStorage, data: object): void => {
        try {
            localStorage.setItem(`${NAMESPACE}_${name}`, JSON.stringify(data))
        } catch (error) {
            notification.create("Notification.LocalStorageSaveFailed")
        }
    },
    DEBOUNCE_LOCAL_STORAGE
)

export const saveIndexedDB = debounce(
    (name: StateInIndexedDB, data: object): void => {
        try {
            localforage.setItem(`${NAMESPACE}_${name}`, data)
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
