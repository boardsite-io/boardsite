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
            console.time("serialize")
            const s = serializer()
            console.timeEnd("serialize")

            console.time("localforage")
            await localforage.setItem(`${NAMESPACE}_${name}`, s)
            console.timeEnd("localforage")
        } catch (error) {
            console.log(error)
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
